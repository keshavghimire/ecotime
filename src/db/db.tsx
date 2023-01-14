import SQLite from "react-native-sqlite-2";

export const site_type_tbl = 'site_type_tbl';
export const site_tbl = 'site_tbl';
export const question_category_tbl = 'question_category_tbl';
export const reasons_tbl = 'reasons_tbl';
export const user_category_tbl = 'user_category_tbl';
export const inspections_tbl = 'inspections_tbl';
export const mobile_data_tbl = 'mobile_data_tbl';
export const mobile_data_tbl_2 = 'mobile_data_tbl_2';
export const category_tbl = 'category_tbl';
export const file_tbl = 'file_tbl';
export const survey_tbl = 'completed_survey_tbl';

export const time_tbl = 'time_tbl';


const connection = SQLite.openDatabase({name: 'ecotime.db', location: 'default'}, () => {
    console.log('database connected successfully');
}, (err: any) => {
    console.log(err);
});


const CREATE_TIME_TBL = () => {
    connection.transaction((txn: any) => {
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${time_tbl} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT NULL, 
                start_time VARCHAR DEFAULT NULL, 
                end_time VARCHAR DEFAULT NULL
            )`,
            []
        );
    })
}


const DROP_TABLE = (table_name: string) => {
    connection.transaction((txn) => {
        txn.executeSql(`DROP TABLE IF EXISTS ${table_name}`, []);
        if(table_name == mobile_data_tbl){
            insertAllMobileData_TBL([]);
        }
    }, (error) => {
        console.log(error)
    }, () => {
        console.log('TABLE DROPPED !!!')
    })
}


const insertSiteTypeData_TBL = (data: Array<object>) => {
    connection.transaction((txn: any) => {
        
        // txn.executeSql(`DROP TABLE IF EXISTS ${site_type_tbl}`, []);
        // txn.executeSql(`DROP TABLE IF EXISTS ${survey_tbl}`, []);
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${file_tbl} (file_path TEXT, file_name TEXT, media_type, is_synced BOOLEAN)`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${survey_tbl} (
                transactionNo VARCHAR, siteId VARCHAR(255), siteCode VARCHAR(50), siteName VARCHAR(255),
                inspectionId VARCHAR(255), inspectionCode VARCHAR(255), rawData TEXT, 
                responseStartDate VARCHAR(50), responseEndDate VARCHAR(50), gpsCoordinate VARCHAR(255),
                is_synced BOOLEAN
            )`,
            []
        );

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${site_type_tbl} (sTypeID INTEGER PRIMARY KEY,sType VARCHAR(255), icon VARCHAR(255), enable BOOLEAN)`,
            []
        );

        txn.executeSql(`select * from ${site_type_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => m.sTypeID).includes(d.sTypeID));
                var new_data = data.filter((d: any) => !res.map((m: any) => m.sTypeID).includes(d.sTypeID));
                old_data.forEach((d: object) => {
                    txn.executeSql(`UPDATE ${site_type_tbl} 
                    SET sType = ?, icon = ?, enable = ?
                    WHERE sTypeID = ?`, 
                    [d['sType'], d['icon'], d['enable'], d['sTypeID']]
                    );
                });
                new_data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${site_type_tbl} (sTypeID, sType, icon, enable) VALUES (:sTypeID, :sType, :icon, :enable)`, [d['sTypeID'], d['sType'], d['icon'], d['enable']]);
                });
            }else{
                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${site_type_tbl} (sTypeID, sType, icon, enable) VALUES (:sTypeID, :sType, :icon, :enable)`, [d['sTypeID'], d['sType'], d['icon'], d['enable']]);
                });
            }
        });

    },(error: any) => {
        // error callback
        console.log(error);
    },() => {
        // success callback
    })
};

const insertSiteData_TBL = (data: Array<object>) => {
    connection.transaction((txn: any) => {
        
        // txn.executeSql(`DROP TABLE IF EXISTS ${site_tbl}`, []);

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${site_tbl} (siteID INTEGER PRIMARY KEY NOT NULL,
                siteName VARCHAR(255), icon VARCHAR(255), sType VARCHAR(255),
                siteCode VARCHAR(255), siteLat VARCHAR(255), siteLog VARCHAR(255),
                sTypeId INTEGER, lastAuditedOn VARCHAR(255), siteAddress TEXT, assets TEXT)`,
            []
        );

        txn.executeSql(`select * from ${site_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => m.siteID).includes(d.siteID));
                var new_data = data.filter((d: any) => !res.map((m: any) => m.siteID).includes(d.siteID));
                old_data.forEach((d: object) => {
                    txn.executeSql(`UPDATE ${site_tbl} 
                    SET siteName = ?, icon = ?, sType = ?, siteCode = ?, siteLat = ?, siteLog = ?, sTypeId = ?, lastAuditedOn = ?, siteAddress = ?, assets = ?
                    WHERE siteID = ?`, 
                    [d['siteName'], d['icon'], d['sType'], d['siteCode'], d['siteLat'], d['siteLog'], d['sTypeId'], d['lastAuditedOn'], d['siteAddress'], JSON.stringify(d['assets']),d['siteID']]
                    );
                });
                new_data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${site_tbl} 
                    (siteID, siteName, icon, sType, siteCode, siteLat, siteLog, sTypeId, lastAuditedOn, siteAddress, assets) 
                    VALUES 
                    (:siteID, :siteName, :icon, :sType, :siteCode, :siteLat, :siteLog, :sTypeId, :lastAuditedOn, :siteAddress, :assets)`, 
                    [d['siteID'], d['siteName'], d['icon'], d['sType'], d['siteCode'], d['siteLat'], d['siteLog'], d['sTypeId'], d['lastAuditedOn'], d['siteAddress'], JSON.stringify(d['assets'])]);
                });
            }else{

                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${site_tbl} 
                    (siteID, siteName, icon, sType, siteCode, siteLat, siteLog, sTypeId, lastAuditedOn, siteAddress, assets) 
                    VALUES 
                    (:siteID, :siteName, :icon, :sType, :siteCode, :siteLat, :siteLog, :sTypeId, :lastAuditedOn, :siteAddress, :assets)`, 
                    [d['siteID'], d['siteName'], d['icon'], d['sType'], d['siteCode'], d['siteLat'], d['siteLog'], d['sTypeId'], d['lastAuditedOn'], d['siteAddress'], JSON.stringify(d['assets'])]);
                });
            }
        });
    })
};


const insertQuestionCategoryData_TBL = (data: Array<object>) => {
    
    connection.transaction((txn: any) => {
        
        // txn.executeSql(`DROP TABLE IF EXISTS ${question_category_tbl}`, []);

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${question_category_tbl} (qCategoryID INTEGER PRIMARY KEY NOT NULL,
                sTypeId INTEGER, displayOrder INTEGER,  enable BOOLEAN,
                qCategoryName VARCHAR(255), incidentMailTo VARCHAR(255), qCategoryCode VARCHAR(255), 
                isSurveyCompleted BOOLEAN, isSurveySynced BOOLEAN)`,
            []
        );

        txn.executeSql(`select * from ${question_category_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => m.qCategoryID).includes(d.qCategoryID));
                var new_data = data.filter((d: any) => !res.map((m: any) => m.qCategoryID).includes(d.qCategoryID));
                old_data.forEach((d: object) => {
                    txn.executeSql(`UPDATE ${question_category_tbl} 
                    SET sTypeId = ?, displayOrder = ?, enable = ?, qCategoryName = ?, incidentMailTo = ?, qCategoryCode = ?,
                    isSurveyCompleted = ?, isSurveySynced = ?
                    WHERE qCategoryID = ?`, 
                    [d['sTypeId'], d['displayOrder'], d['enable'], d['qCategoryName'],
                    d['incidentMailTo'], d['qCategoryCode'], d['isSurveyCompleted'], d['isSurveySynced'], d['qCategoryID']]
                    );
                });
                new_data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${question_category_tbl} 
                    (qCategoryID, sTypeId, displayOrder, enable, qCategoryName, incidentMailTo, qCategoryCode,
                        isSurveyCompleted, isSurveySynced) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [d['qCategoryID'], d['sTypeId'], d['displayOrder'], d['enable'], d['qCategoryName'],
                    d['incidentMailTo'], d['qCategoryCode'], false, false],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }else{
                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${question_category_tbl} 
                    (qCategoryID, sTypeId, displayOrder, enable, qCategoryName, incidentMailTo, qCategoryCode,
                        isSurveyCompleted, isSurveySynced) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [d['qCategoryID'], d['sTypeId'], d['displayOrder'], d['enable'], d['qCategoryName'],
                    d['incidentMailTo'], d['qCategoryCode'], false, false],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }
        });
        
        

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};


const insertInspectionsData_TBL = (data: Array<object>) => {

    connection.transaction((txn: any) => {
        
        txn.executeSql(`DROP TABLE IF EXISTS ${inspections_tbl}`, []);

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${inspections_tbl} (inspectionNo VARCHAR(255) PRIMARY KEY NOT NULL,
                inspectionName VARCHAR(255),inspectionCode VARCHAR(255),
                inspectionId VARCHAR(255),inspectionStatus VARCHAR(50),inspectedBy VARCHAR(255),
                inspectedOn VARCHAR(255),siteName VARCHAR(255),siteCode VARCHAR(255))`,
            []
        );


        txn.executeSql(`select * from ${inspections_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => m.reasonID).includes(d.reasonID));
                var new_data = data.filter((d: any) => !res.map((m: any) => m.reasonID).includes(d.reasonID));
                old_data.forEach((d: object) => {
                    txn.executeSql(`UPDATE ${inspections_tbl} 
                    SET  inspectionName = ?,inspectionCode = ?,inspectionId = ?,inspectionStatus = ?,inspectedBy = ?,inspectedOn = ?,siteName = ?,siteCode = ?
                    WHERE inspectionNo = ?`, 
                    [d['inspectionName'], d['inspectionCode'], d['inspectionId'], d['inspectionStatus'], d['inspectedBy'], d['inspectedOn'], d['siteName'], d['siteCode'], d['inspectionNo']]
                    );
                });
                new_data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${inspections_tbl} 
                    (inspectionId,inspectionName,inspectionCode,inspectionNo,inspectionStatus,inspectedBy,inspectedOn,siteName,siteCode) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [d['inspectionId'], d['inspectionName'], d['inspectionCode'], d['inspectionNo'], d['inspectionStatus'], d['inspectedBy'], d['inspectedOn'], d['siteName'], d['siteCode']],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }else{
                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${inspections_tbl} 
                    (inspectionId,inspectionName,inspectionCode,inspectionNo,inspectionStatus,inspectedBy,inspectedOn,siteName,siteCode) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [d['inspectionId'], d['inspectionName'], d['inspectionCode'], d['inspectionNo'], d['inspectionStatus'], d['inspectedBy'], d['inspectedOn'], d['siteName'], d['siteCode']],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }
        });
        

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};


const insertReasonsData_TBL = (data: Array<object>) => {

    connection.transaction((txn: any) => {
        
        // txn.executeSql(`DROP TABLE IF EXISTS ${reasons_tbl}`, []);

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${reasons_tbl} (reasonID INTEGER PRIMARY KEY NOT NULL,
                reasonText VARCHAR(255), tags VARCHAR(255),qCategoryId INTEGER,
                enable BOOLEAN)`,
            []
        );


        txn.executeSql(`select * from ${reasons_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => m.reasonID).includes(d.reasonID));
                var new_data = data.filter((d: any) => !res.map((m: any) => m.reasonID).includes(d.reasonID));
                old_data.forEach((d: object) => {
                    txn.executeSql(`UPDATE ${reasons_tbl} 
                    SET qCategoryId = ?, enable = ?, reasonText = ?, tags = ?
                    WHERE reasonID = ?`, 
                    [d['qCategoryId'], d['enable'], d['reasonText'], d['tags'], d['reasonID']]
                    );
                });
                new_data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${reasons_tbl} 
                    (reasonID, reasonText, tags, qCategoryId, enable) 
                    VALUES (?, ?, ?, ?, ?)`, 
                    [d['reasonID'], d['reasonText'], d['tags'], d['qCategoryId'], d['enable']],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }else{
                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${reasons_tbl} 
                    (reasonID, reasonText, tags, qCategoryId, enable) 
                    VALUES (?, ?, ?, ?, ?)`, 
                    [d['reasonID'], d['reasonText'], d['tags'], d['qCategoryId'], d['enable']],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }
        });
        
        
        

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};

const insertAllMobileData_TBL = (data: Array<object>) => {
    connection.transaction((txn: any) => {
        
        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${mobile_data_tbl} (inspectionId INTEGER PRIMARY KEY NOT NULL,
                scode VARCHAR(255), sname VARCHAR(255),stypeId INTEGER,
                stype VARCHAR(255), question TEXT)`,
            []
        );

        txn.executeSql(`select * from ${inspections_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => parseInt(m.inspectionId)).includes(d.inspectionId));
                var new_data = data.filter((d: any) => !res.map((m: any) => parseInt(m.inspectionId)).includes(d.inspectionId));

                txn.executeSql(`select * from ${mobile_data_tbl}`, [], function(tx, mobile_response){
                    if(mobile_response.rows.length == 0){
                        data.forEach((d: object) => {
                            txn.executeSql(`INSERT INTO ${mobile_data_tbl} 
                            (inspectionId, scode, sname, stypeId, stype, question) 
                            VALUES (?, ?, ?, ?, ?, ?)`, 
                            [d['inspectionId'], d['scode'], d['sname'], d['stypeId'], d['stype'],
                            JSON.stringify(d['question'])],
                                (tx: any, results: any) => {
                                    // success callback
                                },(tx: any, error: any) => {
                                    // error callback
                                }
                            )
                        });
                    }else{
                        old_data.forEach((d: object) => {
                            txn.executeSql(`UPDATE ${mobile_data_tbl} 
                            SET scode = ?, sname = ?, stypeId = ?, stype = ?, question = ?
                            WHERE inspectionId = ?`, 
                            [d['scode'], d['sname'], d['stypeId'], d['stype'],
                            JSON.stringify(d['question']), d['inspectionId']],
                                (tx: any, results: any) => {
                                    // success callback
                                },(tx: any, error: any) => {
                                    // error callback
                                    // console.log(error)
                                }
                            );
                        });
                        new_data.forEach((d: object) => {
                            txn.executeSql(`INSERT INTO ${mobile_data_tbl} 
                            (inspectionId, scode, sname, stypeId, stype, question) 
                            VALUES (?, ?, ?, ?, ?, ?)`, 
                            [d['inspectionId'], d['scode'], d['sname'], d['stypeId'], d['stype'],
                            JSON.stringify(d['question'])],
                                (tx: any, results: any) => {
                                    // success callback
                                },(tx: any, error: any) => {
                                    // error callback
                                }
                            )
                        });
                    }
                })               

            }else{
                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${mobile_data_tbl} 
                    (inspectionId, scode, sname, stypeId, stype, question) 
                    VALUES (?, ?, ?, ?, ?, ?)`, 
                    [d['inspectionId'], d['scode'], d['sname'], d['stypeId'], d['stype'],
                    JSON.stringify(d['question'])],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }
            
        });
        
    })
}

const insertAllMobilsdfsdfeData_TBL = (data: Array<object>) => {
    return;
    connection.transaction((txn: any) => {
        
        // txn.executeSql(`DROP TABLE IF EXISTS ${mobile_data_tbl}`, []);

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${mobile_data_tbl} (inspectionId INTEGER PRIMARY KEY NOT NULL,
                scode VARCHAR(255), sname VARCHAR(255),stypeId INTEGER,
                stype VARCHAR(255), question TEXT)`,
            []
        );
        txn.executeSql(`select * from ${inspections_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => parseInt(m.inspectionId)).includes(d.inspectionId));
                var new_data = data.filter((d: any) => !res.map((m: any) => parseInt(m.inspectionId)).includes(d.inspectionId));

                runQuery(`select * from ${mobile_data_tbl}`).then((mobile_data: any) => {
                    
                    if(mobile_data.length == 0){
                        // data.forEach((d: object) => {
                        //     txn.executeSql("INSERT INTO mobile_data_tbl (inspectionId, scode, sname, stypeId, stype, question) VALUES (1, 'sdfsd', 'sdfsdf', 2, 'sssdfd', 'ffsdsdf')"
                        //     ,[],
                        //         (tx: any, results: any) => {
                        //             // success callback
                        //             console.log('success')
                        //         },(tx: any, error: any) => {
                        //             console.log(error);
                        //             // error callback
                        //         }
                        //     )
                        // });
                    }
                    if(mobile_data.length == 0){
                        data.forEach((d: object) => {
                            txn.executeSql(`INSERT INTO mobile_data_tbl (inspectionId, scode, sname, stypeId, stype, question) 
                            VALUES (${d['inspectionId']}, d['scode'], d['sname'], d['stypeId'], d['stype'], JSON.stringify(d['question']))`, [], function(tx, response){
                                console.log(response);
                            }, function(err) {
                                console.log(err)
                            })
                        });
                    }else{
                        console.log('already added');
                    }

                    return;
                    if(mobile_data.length > 0){
                        old_data.forEach((d: object) => {


                            txn.executeSql(`UPDATE ${mobile_data_tbl} 
                            SET scode = ?, sname = ?, stypeId = ?, stype = ?, question = ?
                            WHERE inspectionId = ?`, 
                            [d['scode'], d['sname'], d['stypeId'], d['stype'],
                            JSON.stringify(d['question']), d['inspectionId']],
                                (tx: any, results: any) => {
                                    // success callback
                                },(tx: any, error: any) => {
                                    // error callback
                                    // console.log(error)
                                }
                            );
                        });
                        new_data.forEach((d: object) => {
                            txn.executeSql(`INSERT INTO ${mobile_data_tbl} 
                            (inspectionId, scode, sname, stypeId, stype, question) 
                            VALUES (?, ?, ?, ?, ?, ?)`, 
                            [d['inspectionId'], d['scode'], d['sname'], d['stypeId'], d['stype'],
                            JSON.stringify(d['question'])],
                                (tx: any, results: any) => {
                                    // success callback
                                },(tx: any, error: any) => {
                                    // error callback
                                }
                            )
                        });
                    }else{
                        data.forEach((d: object) => {
                            txn.executeSql(`INSERT INTO ${mobile_data_tbl} 
                            (inspectionId, scode, sname, stypeId, stype, question) 
                            VALUES (?, ?, ?, ?, ?, ?)`, 
                            [d['inspectionId'], d['scode'], d['sname'], d['stypeId'], d['stype'],
                            JSON.stringify(d['question'])],
                                (tx: any, results: any) => {
                                    // success callback
                                },(tx: any, error: any) => {
                                    // error callback
                                }
                            )
                        });
                    }
                })
                

            }else{
                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${mobile_data_tbl} 
                    (inspectionId, scode, sname, stypeId, stype, question) 
                    VALUES (?, ?, ?, ?, ?, ?)`, 
                    [d['inspectionId'], d['scode'], d['sname'], d['stypeId'], d['stype'],
                    JSON.stringify(d['question'])],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }
        });

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};

const insertCategoryData_TBL = (data: Array<object>) => {

    connection.transaction((txn: any) => {
        
        txn.executeSql(`DROP TABLE IF EXISTS ${category_tbl}`, []);
        return;

        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${category_tbl} (qCategoryID INTEGER PRIMARY KEY NOT NULL,
                qCategoryName VARCHAR(255), incidentMailTo VARCHAR(255),displayOrder INTEGER,
                sTypeId INTEGER, tenantID INTEGER,
                qCategoryCode VARCHAR(25), sTypeName VARCHAR(255), enable BOOLEAN)`,
            []
        );

        txn.executeSql(`select * from ${inspections_tbl}`, [], function (tx, response) {
            var res: Array<object> = [];
            for (let i = 0; i < response.rows.length; ++i) {
                res.push(response.rows.item(i));
            }
            if(res.length > 0){
                var old_data = data.filter((d: any) => res.map((m: any) => m.qCategoryID).includes(d.qCategoryID));
                var new_data = data.filter((d: any) => !res.map((m: any) => m.qCategoryID).includes(d.qCategoryID));
                old_data.forEach((d: object) => {
                    txn.executeSql(`UPDATE ${inspections_tbl} 
                    SET qCategoryName = ?, incidentMailTo = ?, displayOrder = ?, sTypeId = ?, 
                    tenantID = ?,qCategoryCode = ?,sTypeName = ?,enable = ?
                    WHERE qCategoryID = ?`, 
                    [d['qCategoryName'], d['incidentMailTo'], d['displayOrder'], d['sTypeId'],
                    d['tenantID'], d['qCategoryCode'], d['sTypeName'],d['enable'],d['qCategoryID']]
                    );
                });
                new_data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${category_tbl} 
                    (qCategoryID, qCategoryName, incidentMailTo, displayOrder, sTypeId, tenantID,qCategoryCode,sTypeName,enable) 
                    VALUES (?, ?, ?, ?, ?, ?,?,?,?)`, 
                    [d['qCategoryID'], d['qCategoryName'], d['incidentMailTo'], d['displayOrder'], d['sTypeId'],
                    d['tenantID'], d['qCategoryCode'], d['sTypeName'],d['enable']],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }else{
                data.forEach((d: object) => {
                    txn.executeSql(`INSERT INTO ${category_tbl} 
                    (qCategoryID, qCategoryName, incidentMailTo, displayOrder, sTypeId, tenantID,qCategoryCode,sTypeName,enable) 
                    VALUES (?, ?, ?, ?, ?, ?,?,?,?)`, 
                    [d['qCategoryID'], d['qCategoryName'], d['incidentMailTo'], d['displayOrder'], d['sTypeId'],
                    d['tenantID'], d['qCategoryCode'], d['sTypeName'],d['enable']],
                        (tx: any, results: any) => {
                            // success callback
                        },(tx: any, error: any) => {
                            // error callback
                        }
                    )
                });
            }
        });
        
        

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};

const insertUserCategoryData_TBL = (data: Array<object>) => {

    connection.transaction((txn: any) => {
        
        txn.executeSql(`DROP TABLE IF EXISTS ${user_category_tbl}`, []);

        txn.executeSql(
            `CREATE TABLE ${user_category_tbl} (user_category TEXT)`,
            []
        );
        
        txn.executeSql(`INSERT INTO ${user_category_tbl} (user_category) VALUES (?)`, 
        [JSON.stringify(data)],
            (tx: any, results: any) => {
                // success callback
            },(tx: any, error: any) => {
                // error callback
            }
        )

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};


const insertFileData_TBL = (data: Array<object>) => {

    connection.transaction((txn: any) => {
            
        data.forEach((d: object) => {
            txn.executeSql(`INSERT INTO ${file_tbl} 
            (file_path, file_name, media_type, is_synced) 
            VALUES (?, ?, ?, ?)`, 
            [d['file_path'], d['file_name'], d['media_type'], false],
                (tx: any, results: any) => {
                    // success callback
                },(tx: any, error: any) => {
                    // error callback
                }
            )
        });

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};

const saveSurveyData_TBL = (data: Array<object>) => {

    connection.transaction((txn: any) => {


        txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${survey_tbl} (
                transactionNo VARCHAR, siteId VARCHAR(255), siteCode VARCHAR(50), siteName VARCHAR(255),
                inspectionId VARCHAR(255), inspectionCode VARCHAR(255), rawData TEXT, 
                responseStartDate VARCHAR(50), responseEndDate VARCHAR(50), gpsCoordinate VARCHAR(255),
                is_synced BOOLEAN
            )`,
            []
        );
        
        data.forEach((d: object) => {
            txn.executeSql(`INSERT INTO ${survey_tbl} 
            (transactionNo , siteId , siteCode, siteName,
            inspectionId, inspectionCode, rawData, 
            responseStartDate, responseEndDate, gpsCoordinate, is_synced) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [d['transactionNo'], d['siteId'], d['siteCode'], d['siteName'], d['inspectionId'], 
            d['inspectionCode'], d['rawData'], d['responseStartDate'], d['responseEndDate'], d['gpsCoordinate'],false],
                (tx: any, results: any) => {
                    // success callback
                    console.log('completed');
                },(tx: any, error: any) => {
                    // error callback
                }
            )
        });

    },(error: any) => {
        // error callback
    },() => {
        // success callback
    })
};

const getData = async () => new Promise((resolve, reject) => {
    connection.transaction((txn: any) => {
        txn.executeSql(`SELECT * FROM ${site_type_tbl}`, [], function (tx, res) {
            var data: any = [];
            for (let i = 0; i < res.rows.length; ++i) {
                data.push(res.rows.item(i));
            }
            resolve(data);
        });
    })
});

const runQuery = async (sql: string) => new Promise((resolve, reject) => {
    connection.transaction((txn: any) => {
        txn.executeSql(sql, [], function (tx, res) {
            var data: Array<object> = [];
            for (let i = 0; i < res.rows.length; ++i) {
                data.push(res.rows.item(i));
            }
            resolve(data as Array<object>);
        });
    }, (error) => {
        console.log(error)
    })
})


export {
    insertSiteTypeData_TBL,
    insertSiteData_TBL,
    insertQuestionCategoryData_TBL,
    insertReasonsData_TBL,
    insertInspectionsData_TBL,
    insertAllMobileData_TBL,
    insertCategoryData_TBL,
    insertUserCategoryData_TBL,
    insertFileData_TBL,
    saveSurveyData_TBL,
    getData,
    runQuery,
    DROP_TABLE,
    CREATE_TIME_TBL
}
