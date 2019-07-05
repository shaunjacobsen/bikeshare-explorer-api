const { pool } = require('./../db');

module.exports = app => {
  app.get('/', (req, res) => {
    res.send(200);
  });

  app.get('/stations', async (req, res) => {
    try {
      const stations = await pool.query('SELECT * FROM stations');
      if (stations) {
        if (req.query.returnAs === 'geojson') {
          const geoJson = {
            type: 'FeatureCollection',
            features: stations.rows.map(station => {
              return {
                type: 'Feature',
                properties: {
                  name: station.station_name,
                  street_address_1: station.street_address_1,
                  street_address_2: station.street_address_2,
                  city: station.city,
                  docks: station.total_docks,
                },
                geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(station.longitude), parseFloat(station.latitude)],
                },
              };
            }),
          };
          res.json(geoJson);
          return;
        }
        res.json(stations.rows);
      } else {
        res.status(401).send();
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });

  app.get('/station/:stationId', async (req, res) => {
    const stationId = req.params.stationId;
    try {
      const station = await pool.query(
        'SELECT * FROM stations WHERE id = $1::integer',
        [stationId],
      );
      if (station.rowCount > 0) {
        res.json(station.rows[0]);
      } else {
        res.status(401).send();
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });

  app.get('/stats/from/:stationId', async (req, res) => {
    const stationId = req.params.stationId;
    const query = req.query.r.split(',');
    let result = {};

    try {
      const results = await pool.query(
        'SELECT * FROM cache_data WHERE start_station_id = $1::integer',
        [stationId],
      );

      query.forEach(queryItem => {
        result[queryItem] = results.rows[0][queryItem];
      });

      res.json(result);
    } catch (e) {
      res.status(500).json(e);
    }
  });
};
