Moonwell Yield Tracker

TDLR: Tracking yield for supplied assets on Moonwell is hard(not rewards). We propose a web interface to see yield changes over time.



[1] As a Moonwell user, I want to open a Moonwell Flagship USDC position in Moonwell and see how the assets and yield have grown and might grow over time:



[2] As a Moonwell user, I want to show and categorize all my transactions:


Requirements:

- Add wallet to track [1]
- Graphs that show data [1]
- Table to show all transactions and tag a category to them[2]




Graphs
Stacked line chart that can be in USD/nominal terms that show:
  - All assets over time(base asset added)
  - Yield accrued over time(new assets)
  - Rewards over time (well/morpho)


Transaction Data to Display:

name on interface: tx data name ; function
____
Date: blockTimestamp ;convert to regular date
Type: XXX; User Dropdown(lend/nft)
Details: XXX; user text field
Value: value; N/a
To: to; Basename
From :from; Basename
Hash :transactionHash; N/A



need to have
[x] graph
[x] transaction modules
[x] key metrics
[x] starting position
[x] position over time
[x] position usdc value over time
[x] all transactions
[x] hookup transaction data
[x] hookup balance data
  [x] just assets.
  [x] switch between positions
[x] scale to other positions
[x] wallet connect
[x] Loan Module Fixed



UX

[] Metrics Module: 
  [] Total Assets (moonell positions + ETH)
  [] Live Yield
  [] Average Yield from vaults 
  [] total rewards (well tokens)




Functionality

[] wallet connected to everywhere





nice to have
[] yield over time
[] rewards

[] wallet connect trigger everything
[] data refresh button
