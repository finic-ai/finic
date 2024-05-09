from models.models import (
    Listing,
    ListingActivityStatus,
    ListingWithContactInfo,
    Message,
    RankingMetadata,
    Filters,
    SellerInfo,
    BuyerInfo,
    ApprovalStatus,
)
import datetime
from datetime import timedelta
from typing import List, Tuple, Optional
import pytz


def parse_timestamp(timestamp_str) -> Optional[datetime.datetime]:
    if not timestamp_str:
        return None
    for fmt in ("%Y-%m-%dT%H:%M:%S.%f%z", "%Y-%m-%dT%H:%M:%S%z"):
        try:
            return datetime.datetime.strptime(timestamp_str, fmt)
        except ValueError:
            continue
    raise ValueError(f"time data '{timestamp_str}' does not match format")


class RankingHelper:
    def __init__(self):
        pass

    def rank_listings(
        self, listings: List[ListingWithContactInfo]
    ) -> Tuple[List[ListingWithContactInfo], List[RankingMetadata]]:
        ranked_listings = []

        # sort by response rate but put the new ones at the top.

        def rank_index(listing):
            ranking_metadata = self.get_ranking_metadata(listing)
            if ranking_metadata.response_rate_percentage is None:
                return 1
            return ranking_metadata.response_rate_percentage

        ranked_listings = sorted(
            listings,
            key=rank_index,
            reverse=True,
        )

        ranked_listings = sorted(
            ranked_listings,
            key=lambda listing: self.get_ranking_metadata(listing).new,
            reverse=True,
        )

        ranking_metadata = [
            self.get_ranking_metadata(listing) for listing in ranked_listings
        ]

        return ranked_listings, ranking_metadata

    def get_ranking_metadata(self, listing: Listing) -> RankingMetadata:
        messages = [message for message in listing.messages if message.sent_at]

        approved_at = parse_timestamp(listing.approved_at)
        new = False
        if approved_at:
            one_week_ago = datetime.datetime.now(approved_at.tzinfo) - timedelta(
                weeks=1
            )
            new = approved_at > one_week_ago

        if len(messages) == 0:
            return RankingMetadata(
                listing_id=listing.id,
                active_conversations=0,
                new=new,
            )

        responded = [message for message in messages if not message.pending]

        response_timestamps = [
            message.responded_at for message in responded if message.responded_at
        ]

        return RankingMetadata(
            listing_id=listing.id,
            response_rate_percentage=int((len(responded) / len(messages)) * 100),
            last_activity_timestamp=max(response_timestamps, default=None),
            active_conversations=len(responded),
            new=new,
        )

    def filter_out_messages_from_unapproved_buyers(
        self, messages: List[Message]
    ) -> List[Message]:
        result = []
        for message in messages:
            app_id = message.sender_app_id

    def listing_is_inactive(self, listing: Listing) -> bool:
        # we define inactive as having a 0% response rate to messages received in the last 30 days
        # and having 2+ messages that are at least 14 days old

        has_2_old_messages = False
        num_old_messages = 0

        for message in listing.messages:
            if message.sent_at and message.sent_at < (
                int(datetime.datetime.now().timestamp()) - 60 * 60 * 24 * 14
            ):
                num_old_messages += 1
            if num_old_messages >= 2:
                has_2_old_messages = True
                break

        if not has_2_old_messages:
            return False

        messages_received_in_last_30_days = [
            message
            for message in listing.messages
            if message.sent_at
            and message.sent_at
            > (int(datetime.datetime.now().timestamp()) - 60 * 60 * 24 * 30)
        ]

        # messages_received_in_last_30_days = (
        #     self.filter_out_messages_from_unapproved_buyers(
        #         messages_received_in_last_30_days
        #     )
        # )

        has_0_percent_response_rate = len(messages_received_in_last_30_days) > 0

        for message in messages_received_in_last_30_days:
            if not message.pending:
                has_0_percent_response_rate = False
                break

        return has_0_percent_response_rate

    def get_pending_messages(self, listing: Listing) -> List[Message]:
        pending_messages = []
        for message in listing.messages:
            if message.pending and message.sent_at:
                pending_messages.append(message)
        return pending_messages

    def update_listing_activity_status(
        self, listing: ListingWithContactInfo
    ) -> ListingWithContactInfo:
        if (
            listing.activity_status == ListingActivityStatus.active
            and self.listing_is_inactive(listing)
        ):
            listing.activity_status = ListingActivityStatus.inactive_day_1
        elif listing.activity_status == ListingActivityStatus.inactive_day_1:
            listing.activity_status = ListingActivityStatus.inactive_day_2
        elif listing.activity_status == ListingActivityStatus.inactive_day_2:
            listing.activity_status = ListingActivityStatus.inactive_day_3
        elif listing.activity_status == ListingActivityStatus.inactive_day_3:
            listing.activity_status = ListingActivityStatus.inactive_day_4
        elif listing.activity_status == ListingActivityStatus.inactive_day_4:
            listing.activity_status = ListingActivityStatus.inactive_day_5
        elif listing.activity_status == ListingActivityStatus.inactive_day_5:
            listing.activity_status = ListingActivityStatus.inactive_day_6
        elif listing.activity_status == ListingActivityStatus.inactive_day_6:
            listing.activity_status = ListingActivityStatus.inactive_day_7
        elif listing.activity_status == ListingActivityStatus.inactive_day_7:
            listing.activity_status = ListingActivityStatus.permanently_inactive

        return listing

    def filter_listings(
        self, listings: List[ListingWithContactInfo], filters: Optional[Filters] = None
    ) -> List[ListingWithContactInfo]:
        if not filters:
            return listings
        filtered_listings = []
        for listing in listings:
            if self.listing_matches_filters(listing, filters):
                filtered_listings.append(listing)

        return filtered_listings

    def filter_unapproved_listings(
        self,
        listings: List[ListingWithContactInfo],
        seller_info: Optional[SellerInfo],
        buyer_info: Optional[BuyerInfo],
    ) -> List[ListingWithContactInfo]:
        # Filter out all listings that are not approved unless they are the seller's listings or a buyer has messaged them

        to_return = [
            listing for listing in listings if listing.status == ApprovalStatus.approved
        ]

        unapproved_listings = [
            listing for listing in listings if listing.status != ApprovalStatus.approved
        ]

        if seller_info:
            # all of the seller's listings are visible
            return to_return + [
                listing
                for listing in unapproved_listings
                if listing.seller_id == seller_info.user_id
            ]
        elif buyer_info:
            # all listings that the buyer has messaged are visible
            return to_return + [
                listing
                for listing in unapproved_listings
                if buyer_info.user_id
                in [
                    message.sender_user_id
                    for message in listing.messages
                    if message.sender_user_id
                ]
            ]

        return to_return

    def listing_matches_filters(self, listing: Listing, filters: Filters) -> bool:
        if filters.arr and len(filters.arr) == 2:
            min_arr = filters.arr[0]
            max_arr = filters.arr[1]

            if not listing.revenue:
                return False

            if (min_arr is not None and listing.revenue < min_arr) or (
                max_arr is not None and listing.revenue > max_arr
            ):
                return False

        if filters.ebitda and len(filters.ebitda) == 2:
            min_ebitda = filters.ebitda[0]
            max_ebitda = filters.ebitda[1]

            if not listing.ebitda:
                return False

            if (min_ebitda is not None and listing.ebitda < min_ebitda) or (
                max_ebitda is not None and listing.ebitda > max_ebitda
            ):
                return False

        if filters.profitability and len(filters.profitability) == 1:
            profitability = filters.profitability[0]

            if profitability == "profitable" and not listing.profitability:
                return False
            elif profitability == "not_profitable" and listing.profitability:
                return False
        print(filters.type, listing.type)
        if filters.type and len(filters.type) > 0:
            if listing.type not in filters.type:
                return False

        return True
