# AI Prompts
**Musical Journey Narrative Generation**

**Last Updated:** [DATE]
**AI Model:** Anthropic Claude (claude-sonnet-4-20250514)

---

## Table of Contents
- [Overview](#overview)
- [Prompt Templates](#prompt-templates)
- [Pathway Types](#pathway-types)
- [Response Formats](#response-formats)
- [Prompt Engineering Guidelines](#prompt-engineering-guidelines)
- [Examples](#examples)

---

## Overview

The Musical Journey feature uses Anthropic's Claude API to generate:
- Musical connection narratives between artists/tracks
- Context-aware pathway explanations
- Genre and influence descriptions

**API Client:** `/src/services/ai-client.js`

---

## Prompt Templates

### Narrative Generation (Artist to Artist)

**System Prompt:**
```
[System prompt to be added]
```

**User Prompt Template:**
```
[User prompt template to be added]
```

**Variables:**
- `{fromArtist}`: Starting artist name
- `{toArtist}`: Connected artist name
- `{pathwayType}`: Connection type (influences, legacy, collaborators, contemporaries, genre)
- `{fromGenres}`: Array of starting artist's genres
- `{toGenres}`: Array of connected artist's genres
- `{context}`: Additional context (optional)

---

### Narrative Generation (Track to Track)

**System Prompt:**
```
[System prompt to be added]
```

**User Prompt Template:**
```
[User prompt template to be added]
```

---

### Starting Point Suggestion

**Purpose:** Generate suggested starting points for user exploration.

**System Prompt:**
```
[System prompt to be added]
```

**User Prompt Template:**
```
[User prompt template to be added]
```

---

## Pathway Types

### Influences

**Description:** Artists who influenced the current artist's sound, style, or career.

**Narrative Focus:**
[Focus details to be added]

**Example Prompt:**
```
[Example to be added]
```

---

### Legacy

**Description:** Artists influenced by the current artist.

**Narrative Focus:**
[Focus details to be added]

---

### Collaborators

**Description:** Artists who have worked together on projects.

**Narrative Focus:**
[Focus details to be added]

---

### Contemporaries

**Description:** Artists from the same era/scene/genre.

**Narrative Focus:**
[Focus details to be added]

---

### Genre

**Description:** Artists connected through shared musical genres.

**Narrative Focus:**
[Focus details to be added]

---

## Response Formats

### Narrative Response

**Expected Format:**
```json
{
  "narrative": "string (150-200 words)",
  "connectionType": "influences | legacy | collaborators | contemporaries | genre",
  "confidence": "high | medium | low"
}
```

**Validation:**
[Validation details to be added]

---

### Error Response

```json
{
  "error": "string",
  "retryable": boolean
}
```

---

## Prompt Engineering Guidelines

### Narrative Quality Standards

**Length:** 150-200 words per narrative

**Tone:**
- Conversational but informed
- Educational without being academic
- Enthusiastic about music
- Inclusive and respectful

**Content Requirements:**
- Specific musical connections (not generic)
- Historical context when relevant
- Genre/style explanations
- Career/influence details

**Avoid:**
- Speculation without evidence
- Overly technical music theory
- Repetitive language
- Generic statements

---

### Temperature Settings

```javascript
{
  narrativeGeneration: 0.7,    // Creative but consistent
  pathwaySuggestions: 0.9,     // More creative exploration
  genreDescriptions: 0.5       // Factual and precise
}
```

---

### Token Limits

```javascript
{
  maxTokens: 4096,
  typicalUsage: 300-500 tokens per narrative
}
```

---

## Examples

### Example 1: Influences Pathway

**Input:**
```json
{
  "fromArtist": "Kendrick Lamar",
  "toArtist": "Tupac Shakur",
  "pathwayType": "influences",
  "fromGenres": ["hip hop", "west coast rap", "conscious rap"],
  "toGenres": ["hip hop", "west coast rap", "political rap"]
}
```

**Generated Narrative:**
```
[Example narrative to be added]
```

---

### Example 2: Genre Pathway

**Input:**
```json
{
  "fromArtist": "Taylor Swift",
  "toArtist": "Kacey Musgraves",
  "pathwayType": "genre",
  "fromGenres": ["pop", "country"],
  "toGenres": ["country", "country pop"]
}
```

**Generated Narrative:**
```
[Example narrative to be added]
```

---

## Retry Logic

### Retry Strategy

```javascript
{
  maxRetries: 2,
  retryableErrors: [429, 500, 502, 503, 504],
  backoffStrategy: "exponential",
  baseDelay: 1000,
  maxDelay: 8000
}
```

**Implementation:**
[Implementation details to be added]

---

## Caching Strategy

### When to Cache

- Cache all narratives for 7 days
- Cache key: `narrative:{fromId}:{toId}:{pathwayType}`
- Use Vercel KV for storage

### When to Regenerate

- User explicitly requests regeneration
- Cache expired
- Pathway type changed

---

## References

- [Anthropic Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Architecture](./ARCHITECTURE.md) - System architecture
- [API Routes](./API-ROUTES.md) - Journey API endpoints

---

*Last Updated: [DATE]*
*Version: [VERSION]*
