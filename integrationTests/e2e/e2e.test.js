describe('e2e', () => {
    it('verify', () => {
        expect(process.env.SECRET).toBe("SUPERSECRET");
        expect(process.env.NAMED_SECRET).toBe("SUPERSECRET");
        expect(process.env.OTHERSECRET).toBe("OTHERSUPERSECRET");
        expect(process.env.OTHER_SECRET_OUTPUT).toBe("OTHERSUPERSECRET");
        expect(process.env.ALTSECRET).toBe("CUSTOMSECRET");
        expect(process.env.NAMED_ALTSECRET).toBe("CUSTOMSECRET");
        expect(process.env.OTHERALTSECRET).toBe("OTHERCUSTOMSECRET");
        expect(process.env.FOO).toBe("bar");
        expect(process.env.NAMED_CUBBYSECRET).toBe("zap");
        expect(process.env.SUBSEQUENT_TEST_SECRET).toBe("SUBSEQUENT_TEST_SECRET");
        expect(process.env.JSONSTRING).toBe('{"x":1,"y":"qux"}');
        expect(process.env.JSONSTRINGMULTILINE).toBe('{"x": 1, "y": "q\\nux"}');
        expect(process.env.JSONDATA).toBe('{"x":1,"y":"qux"}');
    });
});
