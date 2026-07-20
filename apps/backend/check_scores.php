<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\SubApps\CreativeReport\Models\CreativeMember;
use App\SubApps\CreativeReport\Models\Assessment;

$members = CreativeMember::where('status', 'active')->get();
foreach ($members as $member) {
    // Check if assessment has scores
    $assessments = Assessment::where('creative_report_member_id', $member->id)->get();
    $hasScores = false;
    foreach($assessments as $a) {
        $scores = $a->creative_scores;
        $total = array_sum($scores);
        if ($total > 0 || $a->leave_count > 0 || $a->absence_count > 0 || $a->late_count > 0) {
            $hasScores = true;
        }
    }
    
    echo "Member: {$member->name} | Has Scores: ".($hasScores ? 'YES' : 'NO')."\n";
}
