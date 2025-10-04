import {
  idAbBidExact,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
  idAbSearchResult,
  idBuyFutBinPrice,
  idAbBidFutBin,
  idBuyFutBinPercent,
} from "../../../elementIds.constants";
import { getDataSource } from "../../../services/repository";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
import {
  clockIcon,
  coinIcon,
  percentIcon,
  searchIcon,
  stackIcon,
} from "../../../utils/uiUtils/icons";

export const buySettingsView = function () {
  const dataSource = getDataSource();
  return `<div class='buyer-settings-wrapper buy-settings-view'>
      ${generateToggleInput(
        "Find Buy Price",
        { idBuyFutBinPrice },
        `(Uses ${dataSource} price for Buy)`,
        "BuyerSettings"
      )}
      ${generateTextInput(
        "Buy/Bid Price Percent",
        100,
        { idBuyFutBinPercent },
        `(Buy/Bid Price percent of ${dataSource} Price)`,
        "BuyerSettings",
        undefined,
        undefined,
        undefined,
        null,
        percentIcon
      )}
      ${generateToggleInput(
        `Bid For ${dataSource} Price`,
        { idAbBidFutBin },
        `(Bid if the current bid is lesser than ${dataSource} Price)`,
        "BuyerSettings"
      )}
      ${generateTextInput(
        "Buy Price",
        "",
        { idAbBuyPrice },
        "<br/>",
        "BuyerSettings",
        undefined,
        undefined,
        undefined,
        null,
        coinIcon
      )}
      ${generateTextInput(
        "No. of cards to buy",
        1000,
        { idAbCardCount },
        "(Works only with Buy price)",
        "BuyerSettings",
        undefined,
        undefined,
        undefined,
        null,
        stackIcon
      )}
      ${generateTextInput(
        "Bid Price",
        "",
        { idAbMaxBid },
        "<br/>",
        "BuyerSettings",
        undefined,
        undefined,
        undefined,
        null,
        coinIcon
      )}
      ${generateTextInput(
        "Bid items expiring in",
        "1H",
        { idAbItemExpiring },
        "(S for seconds, M for Minutes, H for hours)",
        "BuyerSettings",
        "text",
        "\\d+[H|M|S|h|m|s]$",
        undefined,
        null,
        clockIcon
      )}
      ${generateTextInput(
        "Search result threshold",
        21,
        { idAbSearchResult },
        "(Buy or bid cards only if the no.of search results is lesser than the specified value)",
        "BuyerSettings",
        undefined,
        undefined,
        undefined,
        null,
        searchIcon
      )}
      ${generateToggleInput(
        "Bid Exact Price",
        { idAbBidExact },
        "",
        "BuyerSettings"
      )}      
     </div>
    `;
};
