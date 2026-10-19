# Cstar✨ 🌊 🎵 — 2026 Technica

## Try the prototype
https://russet-tusk-13606100.figma.site

## About the project

<p align="center">
  <img src="2026technica_figma_2/public/cstar-logo.png" alt="Cstar logo" width="180">
</p>

Cstar Music is an accessible music-making workspace designed for blind and low-vision musicians. It brings voice guidance, recording, and track playback into one browser-based experience.

The name, Cstar, comes from Seastar, an ocean animal that use their hands more than eyes to explore the world. We want to provide our human Seastar musicians to create music freely with all other senses.

## Why we started

As music lovers, we could not imagine one day without music. The questions of how we could bring the same music experience to the disabled population is always in our hearts. Being a user ourselves for many music tools, we soon realized that most of them communicate important information visually. That can make it difficult for blind and low-vision musicians to understand where they are, what is available, and what will happen when they act.

We started Cstar to explore a different approach. No cold, mechanical voice to read the page. Instead, users can hear guidance in a more natural voice powered by ElevenLabs. But our hope reaches beyond the sound of that voice, making music without sight should not feel like facing a screen alone. It should feel like a late-night talk with someone who understands your love of music. Warm, patient, and ready to help you turn an idea into a song.

## Design principles

- **Make the interface understandable by listening.** Page descriptions explain the main content and its order, and identify the control or section under the pointer when possible.
- **Keep keyboard actions discoverable.** Shortcuts support common tasks such as adding tracks and starting playback, while spoken instructions help users learn them.
- **Support musical experimentation.** Users can record drum layers, audition their ideas, and work with multiple tracks in a project.
- **Give clear feedback.** Playback, recording, and track actions should make the current state easier to follow.

## What we built

The current prototype includes:

- A music-project workspace with track creation and playback.
- A drum sequencer with keyboard-accessible pads, layered recording, count-in, and looping playback.
- Audio recording and audio-file import for project tracks.
- Keyboard shortcuts for common actions, including adding tracks and controlling playback.
- A read-aloud feature that uses ElevenLabs when available and falls back to the device's speech voice.

This is an evolving prototype. Some features and behaviors may change as we continue testing and refining the experience.

## Challenges we worked through

Building an accessible music workspace meant thinking about more than whether a control can be focused. We also had to consider how a user can understand the page layout, identify the current control, learn keyboard actions, and tell whether recording or playback is active.

We also worked through browser and platform differences in audio playback and text-to-speech. External speech services can be unavailable or behave differently across preview and deployed environments, so the prototype includes a device-voice fallback to keep page guidance available.

## Where we hope to go next

We want to keep improving the clarity and reliability of spoken navigation, refine the experience of recording and arranging multiple tracks, and test the workflow with blind and low-vision musicians. Their feedback should guide what we improve next.

We are also considering transferring Cstar into a plugin on the most used music tools. The users could access to popular existing music tools and collaborate with other musicians with the help of Cstar.

## For reviewers

When exploring Cstar, try navigating with the keyboard and use the page-reading shortcut to hear an overview. In a project, try adding a track, recording a short drum layer, and playing the project. The prototype is an invitation to consider how music software can communicate its structure and controls through sound as well as sight.
