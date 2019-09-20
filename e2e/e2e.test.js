describe('e2e', () => {
    it('verify', () => {
        expect(process.env.A).toBe("1");
        expect(process.env.NAMED_TOKEN).toBe("1");
        expect(process.env.E).toBe("4");
    });
});