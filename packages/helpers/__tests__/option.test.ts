import * as helpers from ".."

describe("option helpers", () => {
  describe("some", () => {
    it("creates a some", () => {
      let o = helpers.some<number>(42)

      expect(helpers.isSome(o)).toBeTruthy()
      expect(helpers.isNone(o)).toBeFalsy()
      expect(helpers.isOption(o)).toBeTruthy()
      expect(o.value).toEqual(42)
    })
  })

  describe("none", () => {
    it("creates a none", () => {
      let o = helpers.none()

      expect(helpers.isSome(o)).toBeFalsy()
      expect(helpers.isNone(o)).toBeTruthy()
      expect(helpers.isOption(o)).toBeTruthy()
    })
  })
})
