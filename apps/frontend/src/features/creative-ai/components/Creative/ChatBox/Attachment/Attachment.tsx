"use client";

import React from "react";
import {
  Menu,
  MenuTrigger,
  MenuItem,
  MenuSection,
  SubmenuTrigger,
  Text,
} from "@react-spectrum/s2/Menu";
import { Button as AriaButton } from "react-aria-components";
import Add from "@react-spectrum/s2/icons/Add";
import Upload from "@react-spectrum/s2/icons/Upload";
import Clock from "@react-spectrum/s2/icons/Clock";
import Project from "@react-spectrum/s2/icons/Project";
import VectorDraw from "@react-spectrum/s2/icons/VectorDraw";
import Apps from "@react-spectrum/s2/icons/Apps";
import Image from "@react-spectrum/s2/icons/Image";
import FileText from "@react-spectrum/s2/icons/FileText";
import Table from "@react-spectrum/s2/icons/Table";
import Code from "@react-spectrum/s2/icons/Code";
import ChartTrend from "@react-spectrum/s2/icons/ChartTrend";
import Cloud from "@react-spectrum/s2/icons/Cloud";
import CCLibrary from "@react-spectrum/s2/icons/CCLibrary";

import { DEFAULT_ATTACHMENT_CONFIG } from "./Attachment.config";
import type { AttachmentProps } from "./Attachment.types";

export type { AttachmentProps, AttachmentItem, AttachmentSubmenuItem } from "./Attachment.types";

/**
 * Child Component: Tombol Attachment (+) dengan Spectrum S2 Menu
 */
export function Attachment({
  onSelectAttachment,
  disabled = false,
  className = "",
  "aria-label": ariaLabel = DEFAULT_ATTACHMENT_CONFIG.ariaLabel,
}: AttachmentProps) {
  return (
    <MenuTrigger direction="top" align="start" shouldFlip={false}>
      <AriaButton
        isDisabled={disabled}
        aria-label={ariaLabel}
        className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-transparent text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40 ${className}`.trim()}
      >
        <Add />
      </AriaButton>
      <Menu
        aria-label="Pilihan Lampiran"
        onAction={(key) => onSelectAttachment?.(String(key))}
      >
        {/* Bagian Atas: Unggah File, Terkini, Proyek */}
        <MenuSection>
          {/* Unggah File */}
          <MenuItem id="upload-file" textValue="Unggah File">
            <Upload />
            <Text slot="label">Unggah File</Text>
          </MenuItem>

          {/* Terkini (Submenu) */}
          <SubmenuTrigger>
            <MenuItem id="recent" textValue="Terkini">
              <Clock />
              <Text slot="label">Terkini</Text>
            </MenuItem>
            <Menu
              aria-label="Berkas Terkini"
              onAction={(key) => onSelectAttachment?.(String(key))}
            >
              <MenuSection>
                <MenuItem id="recent-1" textValue="Desain Banner Promosi.png">
                  <Image />
                  <Text slot="label">Desain Banner Promosi.png</Text>
                </MenuItem>
                <MenuItem id="recent-2" textValue="Dokumen Persyaratan.pdf">
                  <FileText />
                  <Text slot="label">Dokumen Persyaratan.pdf</Text>
                </MenuItem>
                <MenuItem id="recent-3" textValue="Spreadsheet Keuangan.csv">
                  <Table />
                  <Text slot="label">Spreadsheet Keuangan.csv</Text>
                </MenuItem>
              </MenuSection>
            </Menu>
          </SubmenuTrigger>

          {/* Proyek (Submenu) */}
          <SubmenuTrigger>
            <MenuItem id="projects" textValue="Proyek">
              <Project />
              <Text slot="label">Proyek</Text>
            </MenuItem>
            <Menu
              aria-label="Daftar Proyek"
              onAction={(key) => onSelectAttachment?.(String(key))}
            >
              <MenuSection>
                <MenuItem id="proj-1" textValue="Creative Studio App">
                  <Project />
                  <Text slot="label">Creative Studio App</Text>
                </MenuItem>
                <MenuItem id="proj-2" textValue="Universe Design System">
                  <Project />
                  <Text slot="label">Universe Design System</Text>
                </MenuItem>
                <MenuItem id="proj-3" textValue="Brand Guidelines 2026">
                  <Project />
                  <Text slot="label">Brand Guidelines 2026</Text>
                </MenuItem>
              </MenuSection>
            </Menu>
          </SubmenuTrigger>
        </MenuSection>

        {/* Bagian Bawah: Keterampilan & Konektor */}
        <MenuSection>
          {/* Keterampilan (Submenu) */}
          <SubmenuTrigger>
            <MenuItem id="skills" textValue="Keterampilan">
              <VectorDraw />
              <Text slot="label">Keterampilan</Text>
            </MenuItem>
            <Menu
              aria-label="Daftar Keterampilan AI"
              onAction={(key) => onSelectAttachment?.(String(key))}
            >
              <MenuSection>
                <MenuItem id="skill-1" textValue="AI Visual Generator">
                  <VectorDraw />
                  <Text slot="label">AI Visual Generator</Text>
                </MenuItem>
                <MenuItem id="skill-2" textValue="Code Assistant Pro">
                  <Code />
                  <Text slot="label">Code Assistant Pro</Text>
                </MenuItem>
                <MenuItem id="skill-3" textValue="Data Analysis Agent">
                  <ChartTrend />
                  <Text slot="label">Data Analysis Agent</Text>
                </MenuItem>
              </MenuSection>
            </Menu>
          </SubmenuTrigger>

          {/* Konektor (Submenu) */}
          <SubmenuTrigger>
            <MenuItem id="connectors" textValue="Konektor">
              <Apps />
              <Text slot="label">Konektor</Text>
            </MenuItem>
            <Menu
              aria-label="Daftar Konektor Integrasi"
              onAction={(key) => onSelectAttachment?.(String(key))}
            >
              <MenuSection>
                <MenuItem id="conn-1" textValue="Google Drive">
                  <Cloud />
                  <Text slot="label">Google Drive</Text>
                </MenuItem>
                <MenuItem id="conn-2" textValue="GitHub Repo">
                  <Code />
                  <Text slot="label">GitHub Repo</Text>
                </MenuItem>
                <MenuItem id="conn-3" textValue="Adobe Creative Cloud">
                  <CCLibrary />
                  <Text slot="label">Adobe Creative Cloud</Text>
                </MenuItem>
              </MenuSection>
            </Menu>
          </SubmenuTrigger>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}

export default Attachment;
