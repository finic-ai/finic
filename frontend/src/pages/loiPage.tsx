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

posthog.init("phc_GklsIGZF6U38LCVs4D5oybUhjbmFAIxI4gNxVye1dJ4", {
  api_host: "https://app.posthog.com",
});
init("8f535b4f-a447-4278-b242-bd77d408f7e2");

function LoiPage() {
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
          <div className="flex w-full items-start gap-4">
            <HomeCard
              title="Answer Questions"
              subtitle=""
              icon="FeatherFormInput"
            />
            <HomeCard
              title="Generate a LOI"
              subtitle=""
              icon="FeatherSparkles"
            />
            <HomeCard title="Download PDF" subtitle="" icon="FeatherFileDown" />
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full items-center gap-2 border-b border-solid border-neutral-border pt-2 pb-2">
            <span className="w-full grow shrink-0 basis-0 text-body-bold font-body-bold text-default-font">
              5 LOIs
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
            <HomeListItem
              icon="FeatherStore"
              title="XYZ Company"
              subtitle=""
              metadata="In Progress (4/8)"
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
                      <DropdownMenu.DropdownItem icon="FeatherStar">
                        Favorite
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherDownload">
                        Download
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherTrash">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </HomeListItem>
            <HomeListItem
              icon="FeatherBarChart3"
              title="CloudCanopy"
              subtitle=""
              metadata="Created 1 week ago"
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
                      <DropdownMenu.DropdownItem icon="FeatherStar">
                        Favorite
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherTrash">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </HomeListItem>
            <HomeListItem
              icon="FeatherSmartphone"
              title="Freshfare"
              subtitle=""
              metadata="Created 3 weeks ago"
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
                      <DropdownMenu.DropdownItem icon="FeatherEdit">
                        Edit
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherTrash">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </HomeListItem>
            <HomeListItem
              icon="FeatherShoppingCart"
              title="TrendyTrail"
              subtitle=""
              metadata="In Progress (1/8)"
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
                      <DropdownMenu.DropdownItem icon="FeatherStar">
                        Favorite
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherTrash">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </HomeListItem>
            <HomeListItem
              icon="FeatherBell"
              title="Notify"
              subtitle=""
              metadata="Created 3 months ago"
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
                      <DropdownMenu.DropdownItem icon="FeatherStar">
                        Favorite
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherTrash">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </HomeListItem>
            <HomeListItem
              icon="FeatherMic"
              title="Chat House"
              subtitle=""
              metadata="Created 6 months ago"
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
                      <DropdownMenu.DropdownItem icon="FeatherStar">
                        Favorite
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownItem icon="FeatherTrash">
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </HomeListItem>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default LoiPage;