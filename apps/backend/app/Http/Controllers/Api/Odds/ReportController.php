<?php

namespace App\Http\Controllers\Api\Odds;

use App\Http\Controllers\Api\BaseApiController;
use App\SubApps\Odds\Models\DesignerDailyReport;
use App\SubApps\Odds\Models\DesignerRanking;
use App\SubApps\Odds\Services\OddsReportingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends BaseApiController
{
    public function __construct(private OddsReportingService $reports) {}

    public function daily(Request $request): JsonResponse
    {
        $query = DesignerDailyReport::query()->with('designer:id,name,email,username');

        if (!$request->user()->can('view-odds-reports')) {
            $designerProfile = $request->user()->oddsDesignerProfile;
            if (!$designerProfile) {
                return $this->sendResponse(collect(), 'Bukan desainer.');
            }
            $query->where('designer_id', $designerProfile->id);
        }

        if ($request->query('from')) {
            $query->where('report_date', '>=', $request->query('from'));
        }
        if ($request->query('to')) {
            $query->where('report_date', '<=', $request->query('to'));
        }

        return $this->sendResponse($query->latest('report_date')->paginate((int) $request->query('per_page', 25)), 'Daily report ODDS berhasil diambil.');
    }

    public function summary(Request $request): JsonResponse
    {
        return $this->sendResponse($this->reports->summary($request->query()), 'Summary report ODDS berhasil diambil.');
    }

    public function rankings(Request $request): JsonResponse
    {
        $query = DesignerRanking::query()->with('designer:id,name,email,username');

        if ($request->query('period_type')) {
            $query->where('period_type', $request->query('period_type'));
        }

        return $this->sendResponse($query->orderByDesc('total_score')->paginate((int) $request->query('per_page', 25)), 'Ranking ODDS berhasil diambil.');
    }
}
