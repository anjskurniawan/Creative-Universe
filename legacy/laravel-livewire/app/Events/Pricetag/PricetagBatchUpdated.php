<?php

namespace App\Events\Pricetag;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PricetagBatchUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $batchId;

    public function __construct(int $batchId)
    {
        $this->batchId = $batchId;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('pricetag-updates');
    }

    public function broadcastAs(): string
    {
        return 'pricetag.updated';
    }
}
