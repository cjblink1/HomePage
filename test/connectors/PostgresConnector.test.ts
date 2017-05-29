
import * as pg from 'pg';
import * as TypeMoq from 'typemoq';
import { PostgresConnector } from "../../src/connectors/PostgresConnector";

describe("Postgres Connector", () => {

    var poolMock: TypeMoq.IMock<pg.Pool>;
    var clientMock: TypeMoq.IMock<pg.Client>;
    var postgresConnector: PostgresConnector;

    beforeAll(() => {
        poolMock = TypeMoq.Mock.ofType(pg.Pool);
        clientMock = TypeMoq.Mock.ofType(pg.Client);
        poolMock.setup(x => x.connect()).returns(() => Promise.resolve(clientMock.object));
        postgresConnector = new PostgresConnector(poolMock.object);
    });

    it("testInitializesClient", (done: any) => {
        postgresConnector.connect(() => {
            expect(postgresConnector.isConnected()).toBe(true);
            done();
        });
    });

    it("testGetAllLinks", (done: any) => {
        postgresConnector.getAllLinks((links) => {
            expect(links).not.toBeNull();
            done();
        });
    })
});