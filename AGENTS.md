# Animalia contributor instructions

- Write all project documentation, issues, PR descriptions, and user-facing copy in English. The initial MVP uses English animal names and content.
- Read README.md, CONTRIBUTING.md, and the assigned issue before changing files.
- Keep changes scoped to the assigned task. Coordinate shared configuration, dependencies, routes, and data contracts with the integration owner.
- The application uses React, TypeScript, Vite, npm, CSS, and GSAP ScrollTrigger. Read docs/design-direction.md and docs/media-handoff.md before changing the experience or media contract.
- The first screen is the country photo entrance with central Animalia title. The searchable country/territory index uses local flags; only Australia is enabled. The hackathon collection has a South Australia focus: red kangaroo, spinifex hopping mouse, and Australian sea lion. Keep the world entrance and collection separate, with browser-history navigation.
- Media is supplied by the media teammate. Preserve explicit empty states until approved assets arrive; do not substitute other species or invent anatomy coordinates.
- The three `animal-cards-v0.1.0` GLBs are integrated via Three.js. Preserve original model provenance, lazy loading, fallback posters and resource disposal. Models are illustrations, not validated anatomy. Selected field media is integrated; read docs/field-media.md. Do not use the pack's mismatched eastern-grey-kangaroo media or its sea-lion video with unresolved licensing.
- Use a task branch and propose changes through a pull request after the initial repository bootstrap.
- Preserve teammates' uncommitted changes. Never reset or overwrite unrelated work.
- Keep animal facts traceable to sources and image credits traceable to their licenses. Label unverified content explicitly.
- Run checks appropriate to the change and report what actually ran. For UI changes, verify the relevant page and responsive layout when a runnable app exists.
- Never commit secrets or local environment files. Do not publish a deployment unless the user or assigned task authorizes it.
