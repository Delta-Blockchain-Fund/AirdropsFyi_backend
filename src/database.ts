import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || "postgres",
  process.env.POSTGRES_USER || "postgres",
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: "postgres",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });

class Token extends Model {
  name!: string;
  description!: string;
  logoUrl!: string;
  claimUrl!: string;
  symbol!: string;
}
Token.init(
  {
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: new DataTypes.STRING(512),
      allowNull: false,
    },
    logoUrl: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    claimUrl: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    symbol: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: "tokens",
    sequelize,
  }
);

class Wallet extends Model {
  address!: string;
  email?: string;
}
Wallet.init(
  {
    address: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: "wallets",
    sequelize,
  }
);

class WalletToken extends Model {
  walletAddress!: string;
  tokenName!: string;
  amount!: number;
  emailNotified!: boolean;
}
WalletToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    walletAddress: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      references: {
        model: Wallet,
        key: "address",
      },
    },
    tokenName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      references: {
        model: Token,
        key: "name",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emailNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "wallet_tokens",
    sequelize,
  }
);

class Feedback extends Model {
  id!: number;
  rating!: number;
  comment!: string;
}
Feedback.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER, // 1-5
      allowNull: false,
    },
    comment: {
      type: new DataTypes.STRING(512),
      allowNull: false,
    },
  },
  {
    tableName: "feedback",
    sequelize,
  }
);

Token.hasMany(WalletToken, {
  foreignKey: "tokenName",
  sourceKey: "name",
});
WalletToken.belongsTo(Token, {
  foreignKey: "tokenName",
  targetKey: "name",
});
Wallet.hasMany(WalletToken, {
  foreignKey: "walletAddress",
  sourceKey: "address",
});
WalletToken.belongsTo(Wallet, {
  foreignKey: "walletAddress",
  targetKey: "address",
});

sequelize
  .sync()
  .then(() => {
    console.log(`Database & tables created!`);
  })
  .catch((err: any) => {
    console.log(err);
  });

export { sequelize, Token, Wallet, WalletToken, Feedback };
