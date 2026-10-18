# Cstar — 2026 Technica

## About the project

Cstar is an accessible music-making workspace designed with blind and low-vision musicians in mind. It brings musical ideas, voice guidance, recording, and track playback into one browser-based experience.

Our goal is to make creating music feel more direct and understandable: users should be able to explore the workspace through sound and keyboard interaction, then build a project one track at a time.

## Why we started

Many music tools communicate important information visually through timelines, controls, and editing panels. That can make it difficult for blind and low-vision musicians to understand where they are, what is available, and what will happen when they act.

We started Cstar to explore a different approach: make the structure and state of a music workspace available through concise spoken guidance, clear keyboard controls, and audible feedback. Accessibility is part of the creative experience itself, rather than an extra feature added at the end.

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

## For judges and reviewers

When exploring Cstar, try navigating with the keyboard and use the page-reading shortcut to hear an overview. In a project, try adding a track, recording a short drum layer, and playing the project. The prototype is an invitation to consider how music software can communicate its structure and controls through sound as well as sight.
