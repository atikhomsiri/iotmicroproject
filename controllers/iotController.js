const controller = {};

const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const token = "%TOKEN%"
const url = '%URL%'
const client = new InfluxDB({url, token})
let org = `%ORG%`
let bucket = `%BUCKET%`

controller.project = (req,res) => { 
    var projectvalue=null;
    let queryClient = client.getQueryApi(org)
                let fluxQuery = `from(bucket: "DHT")
                |> range(start: -5m)
                |> filter(fn: (r) => r._measurement == "dht")
                |> filter(fn: (r) => r["device"] == "abc")
                |> filter(fn: (r) => r["_field"] == "temp")
                |> last()`
    
                var j=0;
                queryClient.queryRows(fluxQuery, {
                    next: (row, tableMeta) => {
                        const tableObject = tableMeta.toObject(row)
                        console.log(tableObject._value);
                        projectvalue=tableObject._value;
                        j++;
                    },
                    error: (error) => {
                        console.error('\nError', error)
                    },
                    complete: () => {
                        const step = (prop) => {
                            return new Promise(resolve => {
                                setTimeout(() =>
                                resolve(`done ${prop}`), 100);
                            })
                        } 
                        res.render('iotProject',{data:projectvalue});
                    } 
                }); 
              

};

module.exports = controller;