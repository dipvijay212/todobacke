module.exports = {
  development: {
    username: "tododb_lnoy_user",
    password: "CFjOBgimI24EIXdweceS2f0JDJzlsyh2",
    database: "tododb_lnoy",
    host: "dpg-d2v66lmr433s73et07ig-a",
    port: 5432,
    dialect: "postgres",
  },
  production: {
    username: "tododb_lnoy_user",
    password: "CFjOBgimI24EIXdweceS2f0JDJzlsyh2",
    database: "tododb_lnoy",
    host: "dpg-d2v66lmr433s73et07ig-a",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
