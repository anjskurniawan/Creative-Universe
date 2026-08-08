import { useEffect, useState } from "react";
import { coreApi } from "@/core/api/core";
import type { CreativeReportSettings } from "./types";
import {
  DEFAULT_COLLAB_ASPECTS,
  DEFAULT_PERF_ASPECTS,
  DEFAULT_ASPECT_GROUP_TITLES,
  DEFAULT_DETAIL_CARD_ASPECT_INDEXES,
  DEFAULT_SETTINGS,
  GLOBAL_SETTING_KEYS,
} from "./constants";

function parseSettings(values: Record<string, unknown>): CreativeReportSettings {
  const parse = <T,>(key: string, fallback: T): T => {
    const value = values[key];
    if (typeof value !== "string") return fallback;
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  };

  return {
    collabAspects: parse("creative_report_collab_aspects", DEFAULT_COLLAB_ASPECTS),
    perfAspects: parse("creative_report_perf_aspects", DEFAULT_PERF_ASPECTS),
    groupTitles: parse("creative_report_aspect_group_titles", DEFAULT_ASPECT_GROUP_TITLES),
    detailCardAspectIndexes: parse("creative_report_detail_card_aspects", DEFAULT_DETAIL_CARD_ASPECT_INDEXES),
  };
}

export async function loadCreativeReportSettings(): Promise<CreativeReportSettings> {
  try {
    const values = await coreApi.settings.get<Record<string, unknown>>(GLOBAL_SETTING_KEYS);
    return parseSettings(values);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveCreativeReportSettings(settings: CreativeReportSettings): Promise<void> {
  await coreApi.settings.update({
    settings: {
      creative_report_collab_aspects: JSON.stringify(settings.collabAspects),
      creative_report_perf_aspects: JSON.stringify(settings.perfAspects),
      creative_report_aspect_group_titles: JSON.stringify(settings.groupTitles),
      creative_report_detail_card_aspects: JSON.stringify(settings.detailCardAspectIndexes),
    },
  });
}

export function useCreativeReportSettings(options: { initialSettings?: CreativeReportSettings; skipLoad?: boolean } = {}) {
  const { initialSettings = DEFAULT_SETTINGS, skipLoad = false } = options;
  const [settings, setSettings] = useState<CreativeReportSettings>(initialSettings);
  const [loading, setLoading] = useState(!skipLoad);
  useEffect(() => {
    if (skipLoad) return;
    let active = true;
    void loadCreativeReportSettings().then((next) => {
      if (active) {
        setSettings(next);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [skipLoad]);
  return { settings, loading, setSettings };
}
