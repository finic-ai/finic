import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../App.css";
import posthog from "posthog-js";
import {
  init
} from "@feathery/react";
import { DefaultPageLayout } from "../subframe";
import { Table } from "@/subframe/components/Table";
import { Button } from "@/subframe/components/Button";
import { LinkButton } from "@/subframe/components/LinkButton";
import { HomeCard } from "@/subframe/components/HomeCard";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";
import { ToggleGroup } from "@/subframe/components/ToggleGroup";
import { IconButton } from "@/subframe/components/IconButton";
import { HomeListItem } from "@/subframe/components/HomeListItem";
import { getLois, deleteLoi } from "../utils";
import { useUserStateContext } from "../context/UserStateContext";

export type LOI = {
  id: string,
  status: string,
  createdBy: string,
  businessName: string,
  buyerName: string,
  legalEntity: string,
  businessRevenue: number,
  businessEbitda: number,
  purchasePrice: number,
  notePercent: number,
  noteInterestRate: number,
  noteTerm: number,
  noteStandby: number,
  transactionType: string,
  hasEarnout: string,
  hasEscrow: string,
  earnoutDescription: string,
  escrowPercent: number,
  closingDate: Date,
  exclusivityDays: number,
  terminationFeeType: string,
  terminationFeeAmount: number,
  governingLaw: string,
  expirationDate: Date,
  businessAddress: string,
  businessState: string,
  businessEntityType: string,
  sellerName: string,
  equityRolloverPercent: number,
  escrowCap: number,
  escrowTippingBasket: number
}

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

function LoiPage() {
  const { bearer, email, userId } = useUserStateContext();
  const [ lois, setLois ] = useState<Array<LOI> | null>(null);

  useEffect(() => {
    const loadLoiData = async () => {
      const lois = await getLois(bearer, userId);
      console.log(lois);
      setLois(lois);
    };
  
    loadLoiData();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "completed":
        return "Completed";
    }
  }

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-8 bg-default-background pt-12 pb-12">
        <div className="flex w-full items-center gap-2">
          <span className="w-full grow shrink-0 basis-0 text-subheader font-subheader text-default-font">
            LOIs
          </span>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <span className="text-body-bold font-body-bold text-default-font">
            Get started
          </span>
          <span className="text-body font-body text-default-font">
            It takes just 5 minutes to create an LOI on Dealwise.
          </span>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-center gap-2 border-b border-solid border-neutral-border pt-2 pb-2">
            <span className="w-full grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
              {`${lois ? lois.length : 0} LOIs`}
            </span>
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Button
                  variant="neutral-secondary"
                  icon="FeatherArrowUpDown"
                  iconRight="FeatherChevronDown"
                >
                  Sort
                </Button>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon={null}>
                      By name
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={null}>
                      By last edited
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={null}>
                      By date created
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
            <Button size="medium" icon="FeatherPlus" onClick={() => {
              window.location.href = "/create-loi";
            }}>
              Create
            </Button>
            <ToggleGroup className="hidden">
              <ToggleGroup.Item
                className="h-7 w-auto flex-none"
                icon="FeatherLayoutGrid"
                value="239dc264"
              />
              <ToggleGroup.Item
                className="h-7 w-auto flex-none"
                icon="FeatherList"
                value="883d5ac6"
              />
            </ToggleGroup>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            {!lois || lois.length == 0 && <div className="flex w-full items-start gap-4">
              <HomeCard
                title="Answer Questions"
                subtitle=""
                icon="FeatherFormInput"
                className="hover:bg-white cursor-default"
              />
              <HomeCard
                title="Generate a LOI"
                subtitle=""
                icon="FeatherSparkles"
                className="hover:bg-white cursor-default"
              />
              <HomeCard 
                title="Download PDF" 
                subtitle="" 
                icon="FeatherFileDown" 
                className="hover:bg-white cursor-default"
              />
            </div>}
            {lois && lois.map((loi) => (
              <HomeListItem
                icon="FeatherStore"
                title={loi.businessName}
                subtitle={loi.expirationDate ? `Expires ${loi.expirationDate.toString()}`: undefined}
                metadata={getStatusLabel(loi.status)}
                key={loi.id}
              >
                <SubframeCore.DropdownMenu.Root>
                  <SubframeCore.DropdownMenu.Trigger asChild={true}>
                    <IconButton size="medium" icon="FeatherMoreHorizontal" />
                  </SubframeCore.DropdownMenu.Trigger>
                  <SubframeCore.DropdownMenu.Portal>
                    <SubframeCore.DropdownMenu.Content
                      side="bottom"
                      align="end"
                      sideOffset={4}
                      asChild={true}
                    >
                      <DropdownMenu>
                        <DropdownMenu.DropdownItem icon="FeatherDownload">
                          Download PDF
                        </DropdownMenu.DropdownItem>
                        <DropdownMenu.DropdownItem icon="FeatherFileDown">
                          Download DOCX
                        </DropdownMenu.DropdownItem>
                        <DropdownMenu.DropdownItem icon="FeatherEdit" onClick={() => {
                          window.location.href = `/create-loi/${loi.id}`;
                        }}>
                          Edit
                        </DropdownMenu.DropdownItem>
                        <DropdownMenu.DropdownItem icon="FeatherTrash" onClick={() => {
                          deleteLoi(bearer, loi.id);
                        }}>
                          Delete
                        </DropdownMenu.DropdownItem>
                      </DropdownMenu>
                    </SubframeCore.DropdownMenu.Content>
                  </SubframeCore.DropdownMenu.Portal>
                </SubframeCore.DropdownMenu.Root>
              </HomeListItem>
            ))}
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default LoiPage;