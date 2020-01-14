describe('e2e', () => {
    it('verify', () => {
        expect(process.env.SECRET).toBe("SUPERSECRET");
        expect(process.env.NAMED_SECRET).toBe("SUPERSECRET");
        expect(process.env.OTHERSECRET).toBe("OTHERSUPERSECRET");
        expect(process.env.ALTSECRET).toBe("CUSTOMSECRET");
        expect(process.env.NAMED_ALTSECRET).toBe("CUSTOMSECRET");
        expect(process.env.OTHERALTSECRET).toBe("OTHERCUSTOMSECRET");
    });
});
