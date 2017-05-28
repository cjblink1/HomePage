
describe("Postgres Connector", () => {
    var postgresConnector;
    beforeEach(() => {
        postgresConnector = new PostgresConnector();
    });

    it("testConnectsToDatabase", () => {
        expect(postgresConnector.isConnected).toBe(false);
        postgresConnector.connect();
        expect(postgresConnector.isConnected).toBe(true);
    })
});