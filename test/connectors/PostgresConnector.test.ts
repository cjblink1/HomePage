
import * as pg from 'pg';
import * as TypeMoq from 'typemoq';
import { PostgresConnector } from "../../src/connectors/PostgresConnector";

describe("Postgres Connector", () => {

    var poolMock: TypeMoq.IMock<pg.Pool>;
    var clientMock: TypeMoq.IMock<pg.Client>;
    var postgresConnector: PostgresConnector;

    beforeEach(() => {
        poolMock = TypeMoq.Mock.ofType(pg.Pool);
        clientMock = TypeMoq.Mock.ofType(pg.Client);
        poolMock.setup(x => x.connect()).returns(() => Promise.resolve(clientMock.object));
    });

    it("testInitializesClient", (done: any) => {
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.connect(() => {
            expect(postgresConnector.isConnected()).toBe(true);
            done();
        });
    });

    it("testGetAllLinksNotNull", (done: any) => {
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.getAllLinks((links) => {
            expect(links).not.toBeNull();
            done();
        });
    });

    it("testGetAllLinksCorrectValue", (done: any) => {
        var queryResult: pg.QueryResult =  {
            command: "", rowCount: 4, rows: ["Nice", "Work", "Connor"], oid: 0

        }
        clientMock.setup(x => x.query(TypeMoq.It.isValue("SELECT get_all_links(auth := $1)"),
                                      TypeMoq.It.isValue(["validAuthParam"])))
                                      .returns(() => Promise.resolve(queryResult));
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.getAllLinks((links) => {
            expect(links).toBe(["Nice", "Work", "Connor"]);
            done();
        });
    });
});