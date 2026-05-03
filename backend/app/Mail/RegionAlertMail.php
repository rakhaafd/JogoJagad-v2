<?php

namespace App\Mail;

use App\Models\Region;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegionAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly Region $region
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject('Peringatan kondisi wilayah: ' . $this->region->status)
            ->view('emails.region_alert');
    }
}
