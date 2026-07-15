<?php

namespace App\SubApps\Generator\Pricetag\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PricetagBatchUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public int $batchId) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('pricetag-batch.'.$this->batchId);
    }

    public function broadcastAs(): string
    {
        return 'pricetag.updated';
    }
}
