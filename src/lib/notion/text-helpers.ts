/**
 * Helper functions to extract plain text from Notion blocks
 * Used for building search index with full content
 */

import type { Block, RichText } from '../interfaces'

/**
 * Extract plain text from an array of RichText objects
 */
export function extractRichText(richTexts: RichText[] | undefined): string {
  if (!richTexts || richTexts.length === 0) return ''
  return richTexts.map(rt => rt.PlainText || '').join('')
}

/**
 * Recursively extract all plain text from a Notion block and its children
 */
export function extractBlockText(block: Block): string {
  const parts: string[] = []

  // Extract text based on block type
  if (block.Paragraph?.RichTexts) {
    parts.push(extractRichText(block.Paragraph.RichTexts))
    if (block.Paragraph.Children) {
      parts.push(...block.Paragraph.Children.map(extractBlockText))
    }
  }

  if (block.Heading1?.RichTexts) {
    parts.push(extractRichText(block.Heading1.RichTexts))
    if (block.Heading1.Children) {
      parts.push(...block.Heading1.Children.map(extractBlockText))
    }
  }

  if (block.Heading2?.RichTexts) {
    parts.push(extractRichText(block.Heading2.RichTexts))
    if (block.Heading2.Children) {
      parts.push(...block.Heading2.Children.map(extractBlockText))
    }
  }

  if (block.Heading3?.RichTexts) {
    parts.push(extractRichText(block.Heading3.RichTexts))
    if (block.Heading3.Children) {
      parts.push(...block.Heading3.Children.map(extractBlockText))
    }
  }

  if (block.BulletedListItem?.RichTexts) {
    parts.push(extractRichText(block.BulletedListItem.RichTexts))
    if (block.BulletedListItem.Children) {
      parts.push(...block.BulletedListItem.Children.map(extractBlockText))
    }
  }

  if (block.NumberedListItem?.RichTexts) {
    parts.push(extractRichText(block.NumberedListItem.RichTexts))
    if (block.NumberedListItem.Children) {
      parts.push(...block.NumberedListItem.Children.map(extractBlockText))
    }
  }

  if (block.ToDo?.RichTexts) {
    parts.push(extractRichText(block.ToDo.RichTexts))
    if (block.ToDo.Children) {
      parts.push(...block.ToDo.Children.map(extractBlockText))
    }
  }

  if (block.Quote?.RichTexts) {
    parts.push(extractRichText(block.Quote.RichTexts))
    if (block.Quote.Children) {
      parts.push(...block.Quote.Children.map(extractBlockText))
    }
  }

  if (block.Callout?.RichTexts) {
    parts.push(extractRichText(block.Callout.RichTexts))
    if (block.Callout.Children) {
      parts.push(...block.Callout.Children.map(extractBlockText))
    }
  }

  if (block.Toggle?.RichTexts) {
    parts.push(extractRichText(block.Toggle.RichTexts))
    if (block.Toggle.Children) {
      parts.push(...block.Toggle.Children.map(extractBlockText))
    }
  }

  if (block.Code?.RichTexts) {
    parts.push(extractRichText(block.Code.RichTexts))
  }

  if (block.SyncedBlock?.Children) {
    parts.push(...block.SyncedBlock.Children.map(extractBlockText))
  }

  if (block.ColumnList?.Columns) {
    for (const column of block.ColumnList.Columns) {
      if (column.Children) {
        parts.push(...column.Children.map(extractBlockText))
      }
    }
  }

  if (block.Table?.Rows) {
    for (const row of block.Table.Rows) {
      if (row.Cells) {
        for (const cell of row.Cells) {
          parts.push(extractRichText(cell.RichTexts))
        }
      }
    }
  }

  return parts.filter(Boolean).join(' ')
}

/**
 * Extract all plain text from an array of blocks
 */
export function extractBlocksText(blocks: Block[]): string {
  return blocks.map(extractBlockText).filter(Boolean).join(' ')
}
