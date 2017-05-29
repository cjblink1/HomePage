
import * as pg from 'pg';
import * as TypeMoq from 'typemoq';
import { PostgresConnector } from "../../src/connectors/PostgresConnector";

describe("Postgres Connector", () => {

    var poolMock: TypeMoq.IMock<pg.Pool>;
    var clientMock: TypeMoq.IMock<pg.Client>;
    var postgresConnector: PostgresConnector;

    it("testInitializesClient", (done: any) => {
        poolMock = TypeMoq.Mock.ofType(pg.Pool);
        clientMock = TypeMoq.Mock.ofType(pg.Client);
        poolMock.setup(x => x.connect()).returns(() => Promise.resolve(clientMock.object));
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.connect()
            .then(() => {
                expect(postgresConnector.isConnected()).toBe(true);
                done();
            }).catch(() => {
                fail();
                done();
            });
    });

    it("testGetAllLinksNotNull", (done: any) => {
        poolMock = TypeMoq.Mock.ofType(pg.Pool);
        clientMock = TypeMoq.Mock.ofType(pg.Client);
        var queryResult: pg.QueryResult =  {
            command: "", rowCount: 3, rows: ["Nice", "Work", "Connor"], oid: 0
        }
        clientMock.setup(x => x.query(TypeMoq.It.isValue("SELECT get_all_links(auth := $1)"),
                                      TypeMoq.It.isValue(["validAuthParam"])))
                                      .returns(() => Promise.resolve(queryResult));
        poolMock.setup(x => x.connect()).returns(() => Promise.resolve(clientMock.object));
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.connect()
            .then(() => {
                postgresConnector.getAllLinks("validAuthParam")
                    .then(links => {
                        expect(links).not.toBeNull();
                        done();
                    }).catch(() => {
                        fail();
                        done();
                    })
            }).catch(() => {
                fail();
                done();
            });
    });

    it("testGetAllLinksCorrectValue", (done: any) => {
        var expectedValues = ["Nice", "Work", "Connor"]
        poolMock = TypeMoq.Mock.ofType(pg.Pool);
        clientMock = TypeMoq.Mock.ofType(pg.Client);
        var queryResult: pg.QueryResult =  {
            command: "", rowCount: 3, rows: expectedValues, oid: 0
        }
        clientMock.setup(x => x.query(TypeMoq.It.isValue("SELECT get_all_links(auth := $1)"),
                                      TypeMoq.It.isValue(["validAuthParam"])))
                                      .returns(() => Promise.resolve(queryResult));
        poolMock.setup(x => x.connect()).returns(() => Promise.resolve(clientMock.object));
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.connect()
            .then(() => {
                postgresConnector.getAllLinks("validAuthParam")
                    .then(links => {
                        for(var i = 0; i < links.length; i++) {
                            expect(links[i]).toBe(expectedValues[i]);
                        }
                        done();
                    });
            }).catch(() => {
                fail();
                done();
            });
    });
});