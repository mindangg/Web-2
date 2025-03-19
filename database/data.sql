use mobile_store;

DELETE FROM internal_option;

INSERT INTO internal_option (storage, ram)
SELECT s.storage,
       r.ram
FROM (SELECT '4GB' AS ram
      UNION
      SELECT '6GB'
      UNION
      SELECT '8GB'
      UNION
      SELECT '10GB'
      UNION
      SELECT '12GB'
      UNION
      SELECT '16GB'
      UNION
      SELECT '18GB') AS r
         CROSS JOIN
     (SELECT '2TB' AS storage
      UNION
      SELECT '1TB'
      UNION
      SELECT '512GB'
      UNION
      SELECT '256GB'
      UNION
      SELECT '128GB') AS s

