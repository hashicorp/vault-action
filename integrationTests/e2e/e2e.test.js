describe('e2e', () => {
    it('verify', () => {
        expect(process.env.SECRET).toBe("SUPERSECRET");
        expect(process.env.NAMED_SECRET).toBe("SUPERSECRET");
        expect(process.env.OTHERSECRET).toBe("OTHERSUPERSECRET");
    });
});