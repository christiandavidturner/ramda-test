const R = require('ramda');
const fs = require('fs');

const readFileSync = path => fs.readFileSync(path, { encoding: 'utf-8' });

// prepended "date" & "btc/eth"
const readData = R.pipe(
  R.converge(R.concat, [
    R.pipe(
      R.replace(/.*\//, ''),
      R.replace(/\..*/, ''),
      R.concat('date\t'),
      R.concat(R.__, '\n')
    ),
    readFileSync
  ])
);

// pipe accepts functions and composes them into a single function
// then we pass both paths (data) to the created function
R.pipe(
  R.map(
    R.pipe(
      readData,
      R.split('\n'),
      R.dropLast(1),
      R.map(
        R.pipe(
          R.split('\t'),
          R.view(R.lensIndex(1))
        )
      ),
      R.converge(R.map, [
        R.pipe(
          R.head,
          R.objOf
        ),
        R.tail
      ])
    )
  ),
  R.transpose(),
  R.map(R.mergeAll()),
  console.log
)(['./input/btc.csv', './input/eth.csv']);

//
// TAKES THIS:
// [
//   'Jun 12, 2018\t6,905.82\t6,907.96\t6,542.08\t6,582.36\t4,654,380,000\t118,007,000,000\nJun 11, 2018\t6,799.29\t6,910.18\t6,706.63\t6,906.92\t4,745,270,000\t116,175,000,000\nJun 10, 2018\t7,499.55\t7,499.55\t6,709.07\t6,786.02\t5,804,840,000\t128,128,000,000\nJun 09, 2018\t7,632.52\t7,683.58\t7,531.98\t7,531.98\t3,845,220,000\t130,386,000,000\nJun 08, 2018\t7,685.14\t7,698.19\t7,558.40\t7,624.92\t4,227,580,000\t131,271,000,000\nJun 07, 2018\t7,650.82\t7,741.27\t7,650.82\t7,678.24\t4,485,800,000\t130,671,000,000\n',
//   'Jun 12, 2018\t532.71\t538.96\t491.24\t496.84\t1,932,760,000\t53,280,100,000\nJun 11, 2018\t524.86\t536.86\t515.27\t533.28\t1,982,120,000\t52,483,700,000\nJun 10, 2018\t594.35\t594.35\t511.89\t526.48\t2,234,880,000\t59,420,100,000\nJun 09, 2018\t600.91\t608.58\t597.56\t597.56\t1,519,310,000\t60,063,400,000\nJun 08, 2018\t605.44\t608.81\t595.59\t601.08\t1,637,780,000\t60,504,500,000\nJun 07,2018\t607.69\t616.14\t601.69\t605.19\t1,880,140,000\t60,716,100,000\n'
// ];

// AND GIVES YOU THIS:
// [
//   { btc: '6,905.82', eth: '532.71' },
//   { btc: '6,799.29', eth: '524.86' },
//   { btc: '7,499.55', eth: '594.35' },
//   { btc: '7,632.52', eth: '600.91' },
//   { btc: '7,685.14', eth: '605.44' },
//   { btc: '7,650.82', eth: '607.69' }
// ];

//
//
//

// ORIGINAL
//
// const readF = path => fs.readFileSync(path, { encoding: 'utf-8' });
//
// R.pipe(
//   R.map(readF),
//   console.log
// )(['./input/btc.csv', './input/eth.csv']);
