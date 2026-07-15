<?php

namespace Tests\Feature\Core;

use App\Models\Core\AssetLink;
use App\Models\Core\Conversation;
use App\Models\Core\StoredFile;
use App\Models\Core\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class CoreRecordPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_conversation_policy_limits_records_to_participants(): void
    {
        $participant = User::factory()->create();
        $outsider = User::factory()->create();
        $conversation = Conversation::create([
            'context_type' => Conversation::CONTEXT_DIRECT,
            'status' => Conversation::STATUS_OPEN,
        ]);
        $conversation->users()->attach($participant);

        $this->assertTrue(Gate::forUser($participant)->allows('view', $conversation));
        $this->assertTrue(Gate::forUser($participant)->allows('sendMessage', $conversation));
        $this->assertFalse(Gate::forUser($outsider)->allows('view', $conversation));

        $conversation->update(['status' => Conversation::STATUS_CLOSED]);
        $this->assertFalse(Gate::forUser($participant)->allows('sendMessage', $conversation));
    }

    public function test_private_file_and_asset_mutation_are_owner_scoped(): void
    {
        $owner = User::factory()->create();
        $outsider = User::factory()->create();
        $file = StoredFile::create([
            'application_key' => 'core',
            'context_type' => 'test',
            'context_id' => 1,
            'category' => 'documents',
            'disk' => 'local',
            'visibility' => 'private',
            'original_name' => 'contract.pdf',
            'stored_name' => '01JTEST.pdf',
            'path' => 'core/test/1/documents/01JTEST.pdf',
            'mime_type' => 'application/pdf',
            'extension' => 'pdf',
            'size' => 10,
            'checksum_sha256' => str_repeat('a', 64),
            'uploaded_by' => $owner->id,
        ]);
        $asset = AssetLink::create([
            'linkable_type' => User::class,
            'linkable_id' => $owner->id,
            'provider' => 'google_drive',
            'label' => 'Preview',
            'url' => 'https://drive.google.com/file/d/test',
            'created_by' => $owner->id,
        ]);

        $this->assertTrue(Gate::forUser($owner)->allows('view', $file));
        $this->assertFalse(Gate::forUser($outsider)->allows('view', $file));
        $this->assertTrue(Gate::forUser($owner)->allows('update', $asset));
        $this->assertFalse(Gate::forUser($outsider)->allows('update', $asset));
    }
}
