# Hero Heading

**Level:** Atom / Typography  
**Application owner:** Core  
**Status:** stable  
**Live documentation:** `/docs?section=components/hero-heading`

`HeroHeading` is a reusable responsive hero heading. It supports left or center alignment, optional typing animation, configurable typing speed, and additional layout classes.

Public props: `children`, `align`, `className`, `typing`, `typingSpeed`, `onTypingComplete`.

Default typing interval is `110ms` per grapheme, reduced to 50% of the original typing speed.
The gradient cursor remains visible and continues its pulse loop after typing completes.
`onTypingComplete` provides a reusable lifecycle callback for sequencing adjacent content.
Typing reserves the complete final text layout from the first frame and reveals graphemes in place. This locks line wrapping before the animation starts and prevents a late one-line-to-two-line layout jump.
The cursor uses an independent zero-width anchor after the active grapheme, keeping vertical alignment stable when the active character is whitespace.

## Accepted motion contract

- Typing interval: 110ms per grapheme.
- Final line wrapping is reserved before reveal starts.
- Cursor remains visible and loops after completion.
- Cursor alignment is independent from the active character, including whitespace.
- `onTypingComplete` is the sequencing boundary for adjacent content.
