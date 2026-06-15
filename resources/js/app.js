import './bootstrap';

// NOTE: Alpine.js is bundled with Livewire v3 — do NOT import it here.
// Importing Alpine separately causes double-initialization which breaks
// wire:click, wire:poll, and other Livewire directives.
//
// If you need to register Alpine plugins, use Livewire's hook:
// document.addEventListener('livewire:init', () => {
//     Livewire.hook('alpine:init', ({ Alpine }) => {
//         Alpine.plugin(myPlugin);
//     });
// });
