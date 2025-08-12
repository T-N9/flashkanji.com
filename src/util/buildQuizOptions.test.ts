import { buildQuizOptions, OptionSet, QuizItem } from './buildQuizOptions'

describe('buildQuizOptions', () => {
  it('should build correct mora options for a quiz item', () => {
    const mockItem: QuizItem = {
      hiragana: 'にほんご',
      character: '日本語',
      meaning: 'Japanese language'
    }

    const mockAllItems: QuizItem[] = [
      mockItem,
      {
        hiragana: 'えいご',
        character: '英語',
        meaning: 'English language'
      }
    ]

    const result: OptionSet = buildQuizOptions(mockItem, mockAllItems, 5)

    expect(result.correctMoras).toEqual(['に', 'ほん', 'ご'])
    expect(result.options).toEqual(expect.arrayContaining(['に', 'ほん', 'ご']))
    expect(result.options.length).toBeLessThanOrEqual(5)
  })
})
