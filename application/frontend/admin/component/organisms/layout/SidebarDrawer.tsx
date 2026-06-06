"use client";
import { DrawerRoot, DrawerContent, DrawerBackdrop } from "@chakra-ui/react";
import Sidebar from "@/component/organisms/layout/Sidebar";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SidebarDrawer({ isOpen, onClose }: Props) {
  return (
    <DrawerRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="start">
      <DrawerBackdrop />
      <DrawerContent maxW="240px" p={0}>
        <Sidebar />
      </DrawerContent>
    </DrawerRoot>
  );
}
