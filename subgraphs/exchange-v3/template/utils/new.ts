import { Factory, Token } from "../generated/schema";
import { ADDRESS_ZERO, FACTORY_ADDRESS, ZERO_BD, ZERO_BI } from "./constants";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from "./token";
import { Address, log } from "@graphprotocol/graph-ts";

export const createEmptyFactory = () => {
  const factory = new Factory(FACTORY_ADDRESS);
  factory.poolCount = ZERO_BI;
  factory.totalVolumeETH = ZERO_BD;
  factory.totalVolumeUSD = ZERO_BD;
  factory.untrackedVolumeUSD = ZERO_BD;
  factory.totalFeesUSD = ZERO_BD;
  factory.totalFeesETH = ZERO_BD;
  factory.totalProtocolFeesUSD = ZERO_BD;
  factory.totalProtocolFeesETH = ZERO_BD;
  factory.totalValueLockedETH = ZERO_BD;
  factory.totalValueLockedUSD = ZERO_BD;
  factory.totalValueLockedUSDUntracked = ZERO_BD;
  factory.totalValueLockedETHUntracked = ZERO_BD;
  factory.txCount = ZERO_BI;
  factory.owner = ADDRESS_ZERO;

  return factory;
};

export const createEmptyToken = (tokenAddress: Address) => {
  const token0 = new Token(tokenAddress.toHexString());
  token0.symbol = fetchTokenSymbol(tokenAddress);
  token0.name = fetchTokenName(tokenAddress);
  token0.totalSupply = fetchTokenTotalSupply(tokenAddress);
  let decimals = fetchTokenDecimals(tokenAddress);

  // bail if we couldn't figure out the decimals
  if (decimals === null) {
    log.debug("mybug the decimal on token 0 was null", []);
    return;
  }

  token0.decimals = decimals;
  token0.derivedETH = ZERO_BD;
  token0.derivedUSD = ZERO_BD;
  token0.volume = ZERO_BD;
  token0.volumeUSD = ZERO_BD;
  token0.feesUSD = ZERO_BD;
  token0.protocolFeesUSD = ZERO_BD;
  token0.untrackedVolumeUSD = ZERO_BD;
  token0.totalValueLocked = ZERO_BD;
  token0.totalValueLockedUSD = ZERO_BD;
  token0.totalValueLockedUSDUntracked = ZERO_BD;
  token0.txCount = ZERO_BI;
  token0.poolCount = ZERO_BI;
  token0.whitelistPools = [];

  return token0;
};
