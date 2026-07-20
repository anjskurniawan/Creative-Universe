<?php

namespace App\SubApps\Odds\Services;

use App\SubApps\Odds\Models\SystemRule;
use Carbon\CarbonImmutable;

class OddsScheduleService
{
    /**
     * @var array<string, int>
     */
    protected array $globalCapacity = [];

    /**
     * @var string[]
     */
    protected array $holidayCalendar = [];

    public function __construct()
    {
        $this->loadRules();
    }

    protected function loadRules(): void
    {
        $rules = SystemRule::whereIn('key', ['global_daily_capacity', 'holiday_calendar'])->get()->keyBy('key');

        $this->globalCapacity = $rules->get('global_daily_capacity')?->value ?? [
            'monday' => 420,
            'tuesday' => 420,
            'wednesday' => 420,
            'thursday' => 420,
            'friday' => 420,
            'saturday' => 420,
            'sunday' => 0,
        ];

        $this->holidayCalendar = $rules->get('holiday_calendar')?->value['dates'] ?? [];
    }

    public function getGlobalCapacity(): array
    {
        return $this->globalCapacity;
    }

    public function getHolidayCalendar(): array
    {
        return $this->holidayCalendar;
    }

    public function isHoliday(CarbonImmutable $date, ?\App\SubApps\Odds\Models\DesignerProfile $profile = null): bool
    {
        $dateString = $date->format('Y-m-d');
        if (in_array($dateString, $this->holidayCalendar, true)) {
            return true;
        }

        if ($profile && is_array($profile->leave_dates) && in_array($dateString, $profile->leave_dates, true)) {
            return true;
        }

        return false;
    }

    public function getCapacityForDate(CarbonImmutable $date, ?\App\SubApps\Odds\Models\DesignerProfile $profile = null): int
    {
        if ($this->isHoliday($date, $profile)) {
            return 0;
        }

        $dayName = strtolower($date->englishDayOfWeek);
        return $this->globalCapacity[$dayName] ?? 0;
    }

    /**
     * Menghitung tanggal deadline berdasarkan SLA menit, melewati hari-hari libur.
     */
    public function calculateDeadline(CarbonImmutable $start, int $slaMinutes, ?\App\SubApps\Odds\Models\DesignerProfile $profile = null): CarbonImmutable
    {
        $current = $start;
        $remainingSla = $slaMinutes;

        while ($remainingSla > 0) {
            $capacityToday = $this->getCapacityForDate($current, $profile);
            
            if ($capacityToday === 0) {
                // Skip to next day if it's 0 capacity
                $current = $current->addDay()->startOfDay();
                continue;
            }
            
            if ($remainingSla <= $capacityToday) {
                return $current->addMinutes($remainingSla);
            }

            // Kurangi sisa SLA
            $remainingSla -= $capacityToday;
            // Pindah ke hari berikutnya
            $current = $current->addDay()->startOfDay();
        }

        return $current;
    }
}
