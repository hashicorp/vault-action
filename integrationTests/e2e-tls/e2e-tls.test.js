describe('e2e-tls', () => {
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
        expect(process.env.SKIP).toBe("true");
    });
});
