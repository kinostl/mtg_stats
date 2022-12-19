const zipCodes = [
  'Abbeville         AL 36310',
  'Abernant          AL 35440',
  'Acmar             AL 35004',
  'Adamsville        AL 35005',
  'Addison           AL 35540',
  'Adger             AL 35006',
  'Akron             AL 35441',
  'Alabaster         AL 35007',
  'Alabaster         AL 35144',
  'Alberta           AL 36720',
  'Albertville       AL 35950',
  'Alexander City    AL 35010',
  'Alexandria        AL 36250',
  'Aliceville        AL 35442',
  'Allen             AL 36419',
  'Allgood           AL 35013',
  'Alma              AL 36501',
  'Alpine            AL 35014',
  'Alton             AL 35015',
  'Altoona           AL 35952',
  'Andalusia         AL 36420',
  'Anderson          AL 35610',
  'Annemanie         AL 36721',
  'Anniston          AL 36201',
  'Anniston          AL 36202',
  'Anniston          AL 36203',
  'Anniston          AL 36204',
  'Anniston          AL 36205',
  'Anniston          AL 36206',
  'Arab              AL 35016',
  'Ariton            AL 36311',
  'Arley             AL 35541',
  'Arlington         AL 36722',
  'Armstrong         AL 36002',
  'Ashford           AL 36312',
  'Ashland           AL 36251',
  'Ashville          AL 35953',
  'Athens            AL 35611',
  'Atmore            AL 36502',
  'Atmore            AL 36503',
  'Atmore            AL 36504',
  'Attalla           AL 35954',
  'Auburn            AL 36830',
  'Auburn            AL 36831',
  'Auburn            AL 36849',
  'Autaugaville      AL 36003',
  'Axis              AL 36505',
  'Baileyton         AL 35019',
  'Baker Hill        AL 36004',
  'Banks             AL 36005',
  'Bankston          AL 35542',
  'Bay Minette       AL 36507',
  'Bayou La Batre    AL 36509',
  'Bear Creek        AL 35543',
  'Beatrice          AL 36425',
  'Beaverton         AL 35544',
  'Belk              AL 35545',
  'Bellamy           AL 36901',
  'Belle Mina        AL 35615',
  'Bellwood          AL 36313',
  'Berry             AL 35546',
  'Bessemer          AL 35020',
  'Bessemer          AL 35021',
  'Bessemer          AL 35023',
  'Bigbee            AL 36510',
  'Billingsley       AL 36006',
  'Birmingham        AL 35200',
  'Birmingham        AL 35201',
  'Birmingham        AL 35202',
  'Birmingham        AL 35203',
  'Birmingham        AL 35204',
  'Birmingham        AL 35205',
  'Birmingham        AL 35206',
  'Birmingham        AL 35207',
  'Birmingham        AL 35208',
  'Birmingham        AL 35209',
  'Birmingham        AL 35210',
  'Birmingham        AL 35211',
  'Birmingham        AL 35212',
  'Birmingham        AL 35213',
  'Birmingham        AL 35214',
  'Birmingham        AL 35215',
  'Birmingham        AL 35216',
  'Birmingham        AL 35217',
  'Birmingham        AL 35218',
  'Birmingham        AL 35219',
  'Birmingham        AL 35220',
  'Birmingham        AL 35221',
  'Birmingham        AL 35222',
  'Birmingham        AL 35223',
  'Birmingham        AL 35224',
  'Birmingham        AL 35225',
  'Birmingham        AL 35226',
  'Birmingham        AL 35228',
  'Birmingham        AL 35229',
  'Birmingham        AL 35230',
  'Birmingham        AL 35233',
  'Birmingham        AL 35234',
  'Birmingham        AL 35235',
  'Birmingham        AL 35236',
  'Birmingham        AL 35240',
  'Birmingham        AL 35243',
  'Birmingham        AL 35244',
  'Birmingham        AL 35245',
  'Birmingham        AL 35246',
  'Birmingham        AL 35253',
  'Birmingham        AL 35254',
  'Birmingham        AL 35255',
  'Birmingham        AL 35256',
  'Birmingham        AL 35259',
  'Birmingham        AL 35263',
  'Birmingham        AL 35277',
  'Birmingham        AL 35278',
  'Birmingham        AL 35279',
  'Birmingham        AL 35280',
  'Birmingham        AL 35281',
  'Birmingham        AL 35282',
  'Birmingham        AL 35283',
  'Birmingham        AL 35285',
  'Birmingham        AL 35286',
  'Birmingham        AL 35288',
  'Birmingham        AL 35289',
  'Birmingham        AL 35290',
  'Birmingham        AL 35291',
  'Birmingham        AL 35292',
  'Birmingham        AL 35293',
  'Birmingham        AL 35294',
  'Birmingham        AL 35295',
  'Birmingham        AL 35296',
  'Birmingham        AL 35297',
  'Birmingham        AL 35298',
  'Birmingham        AL 35299',
  'Black             AL 36314',
  'Blountsville      AL 35031',
  'Boaz              AL 35957',
  'Boligee           AL 35443',
  'Bolinger          AL 36903',
  'Bon Air           AL 35032',
  'Bon Secour        AL 36511',
  'Booth             AL 36008',
  'Boykin            AL 36723',
  'Brantley          AL 36009',
  'Bremen            AL 35033',
  'Brent             AL 35034',
  'Brewton           AL 36426',
  'Brewton           AL 36427',
  'Bridgeport        AL 35740',
  'Brierfield        AL 35035',
  'Brilliant         AL 35548',
  'Brooklyn          AL 36429',
  'Brookside         AL 35036',
  'Brookwood         AL 35444',
  'Browns            AL 36724',
  'Brownsboro        AL 35741',
  'Brundidge         AL 36010',
  'Bryant            AL 35958',
  'Bucks             AL 36512',
  'Buhl              AL 35446',
  'Burkville         AL 36725',
  'Burnt Corn        AL 36431',
  'Burnwell          AL 35038',
  'Butler            AL 36904',
  'Bynum             AL 36253',
  'Calera            AL 35040',
  'Calvert           AL 36513',
  'Camden            AL 36726',
  'Camp Hill         AL 36850',
  'Campbell          AL 36727',
  'Capshaw           AL 35742',
  'Carbon Hill       AL 35549',
  'Cardiff           AL 35041',
  'Carrollton        AL 35447',
  'Castleberry       AL 36432',
  'Catherine         AL 36728',
  'Cecil             AL 36013',
  'Cedar Bluff       AL 35959',
  'Central           AL 36014',
  'Centre            AL 35960',
  'Centreville       AL 35042',
  'Chance            AL 36729',
  'Chancellor        AL 36316',
  'Chapman           AL 36015',
  'Chatom            AL 36518',
  'Chelsea           AL 35043',
  'Cherokee          AL 35616',
  'Childersburg      AL 35044',
  'Choccolocco       AL 36254',
  'Chunchula         AL 36521',
  'Citronelle        AL 36522',
  'Clanton           AL 35045',
  'Clay              AL 35048',
  'Clayton           AL 36016',
  'Cleveland         AL 35049',
  'Clinton           AL 35448',
  'Clio              AL 36017',
  'Clopton           AL 36317',
  'Cloverdale        AL 35617',
  'Coalburg          AL 35050',
  'Coaling           AL 35449',
  'Coatopa           AL 35450',
  'Coden             AL 36523',
  'Coffee Springs    AL 36318',
  'Coffeeville       AL 36524',
  'Coker             AL 35452',
  'Collinsville      AL 35961',
  'Columbia          AL 36319',
  'Columbiana        AL 35051',
  'Cook Springs      AL 35052',
  'Coosada           AL 36020',
  'Cordova           AL 35550',
  'Cottondale        AL 35453',
  'Cottonton         AL 36851',
  'Cottonton         AL 36859',
  'Cottonwood        AL 36320',
  'Courtland         AL 35618',
  'Cowarts           AL 36321',
  'Coy               AL 36435',
  'Cragford          AL 36255',
  'Crane Hill        AL 35053',
  'Creola            AL 36525',
  'Cropwell          AL 35054',
  'Crossville        AL 35962',
  'Cuba              AL 36907',
  'Cullman           AL 35055',
  'Cullman           AL 35056',
  'Cusseta           AL 36852',
  'Dadeville         AL 36853',
  'Daleville         AL 36322',
  'Daleville         AL 36362',
  'Danville          AL 35619',
  'Daphne            AL 36526',
  'Daphne            AL 36527',
  'Dauphin Island    AL 36528',
  'Daviston          AL 36256',
  'Dawson            AL 35963',
  'Dayton            AL 36731',
  'De Armanville     AL 36257',
  'Deatsville        AL 36022',
  'Decatur           AL 35601',
  'Decatur           AL 35602',
  'Decatur           AL 35603',
  'Decatur           AL 35699',
  'Deer Park         AL 36529',
  'Delmar            AL 35551',
  'Delta             AL 36258',
  'Demopolis         AL 36732',
  'Detroit           AL 35552',
  'Dickinson         AL 36436',
  'Dixiana           AL 35059',
  'Dixons Mills      AL 36736',
  'Docena            AL 35060',
  'Dolomite          AL 35061',
  'Dora              AL 35062',
  'Dothan            AL 36301',
  'Dothan            AL 36302',
  'Dothan            AL 36303',
  'Double Springs    AL 35553',
  'Douglas           AL 35964',
  'Dozier            AL 36028',
  'Duncanville       AL 35456',
  'Dutton            AL 35744',
  'Eastaboga         AL 36260',
  'Echola            AL 35457',
  'Eclectic          AL 36024',
  'Edwardsville      AL 36261',
  'Elba              AL 36323',
  'Elberta           AL 36530',
  'Eldridge          AL 35554',
  'Elkmont           AL 35620',
  'Elmore            AL 36025',
  'Elrod             AL 35458',
  'Emelle            AL 35459',
  'Empire            AL 35063',
  'Enterprise        AL 36330',
  'Enterprise        AL 36331',
  'Epes              AL 35460',
  'Equality          AL 36026',
  'Estillfork        AL 35745',
  'Ethelsville       AL 35461',
  'Eufaula           AL 36027',
  'Eutaw             AL 35462',
  'Eva               AL 35621',
  'Evergreen         AL 36401',
  'Excel             AL 36439',
  'Fabius            AL 35965',
  'Fackler           AL 35746',
  'Fairfield         AL 35064',
  'Fairhope          AL 36532',
  'Fairhope          AL 36533',
  'Falkville         AL 35622',
  'Farmersville      AL 36737',
  'Faunsdale         AL 36738',
  'Fayette           AL 35555',
  'Fernbank          AL 35558',
  'Fitzpatrick       AL 36029',
  'Five Points       AL 36855',
  'Flat Rock         AL 35966',
  'Flomaton          AL 36441',
  'Florala           AL 36442',
  'Florence          AL 35630',
  'Florence          AL 35631',
  'Florence          AL 35632',
  'Florence          AL 35633',
  'Foley             AL 36535',
  'Foley             AL 36536',
  'Forest Home       AL 36030',
  'Forkland          AL 36740',
  'Fort Davis        AL 36031',
  'Fort Deposit      AL 36032',
  'Fort Mitchell     AL 36856',
  'Fort Payne        AL 35967',
  'Fosters           AL 35463',
  'Franklin          AL 36444',
  'Frankville        AL 36538',
  'Frisco City       AL 36445',
  'Fruitdale         AL 36539',
  'Fruithurst        AL 36262',
  'Fulton            AL 36446',
  'Fultondale        AL 35068',
  'Furman            AL 36741',
  'Fyffe             AL 35971',
  'Gadsden           AL 35901',
  'Gadsden           AL 35902',
  'Gadsden           AL 35903',
  'Gadsden           AL 35904',
  'Gadsden           AL 35905',
  'Gadsden           AL 35999',
  'Gainestown        AL 36540',
  'Gainesville       AL 35464',
  'Gallant           AL 35972',
  'Gallion           AL 36742',
  'Gantt             AL 36038',
  'Garden City       AL 35070',
  'Gardendale        AL 35071',
  'Gaylesville       AL 35973',
  'Geneva            AL 36340',
  'Georgiana         AL 36033',
  'Geraldine         AL 35974',
  'Gilbertown        AL 36908',
  'Glen Allen        AL 35559',
  'Glenwood          AL 36034',
  'Goodsprings       AL 35560',
  'Goodwater         AL 35072',
  'Goodway           AL 36449',
  'Gordo             AL 35466',
  'Gordon            AL 36343',
  'Goshen            AL 36035',
  'Grady             AL 36036',
  'Graham            AL 36263',
  'Grand Bay         AL 36541',
  'Grant             AL 35747',
  'Grayson           AL 35562',
  'Graysville        AL 35073',
  'Green Pond        AL 35074',
  'Greensboro        AL 36744',
  'Greenville        AL 36037',
  'Grove Hill        AL 36451',
  'Groveoak          AL 35975',
  'Guin              AL 35563',
  'Gulf Shores       AL 36542',
  'Guntersville      AL 35976',
  'Gurley            AL 35748',
  'Hackleburg        AL 35564',
  'Haleyville        AL 35565',
  'Hamilton          AL 35570',
  'Hanceville        AL 35077',
  'Hardaway          AL 36039',
  'Harpersville      AL 35078',
  'Hartford          AL 36344',
  'Hartselle         AL 35640',
  'Harvest           AL 35749',
  'Hatchechubbee     AL 36858',
  'Havana            AL 35467',
  'Hayden            AL 35079',
  'Hayneville        AL 36040',
  'Hazel Green       AL 35750',
  'Headland          AL 36345',
  'Heflin            AL 36264',
  'Helena            AL 35080',
  'Henagar           AL 35978',
  'Higdon            AL 35979',
  'Highland Home     AL 36041',
  'Hillsboro         AL 35643',
  'Hissop            AL 35081',
  'Hodges            AL 35571',
  'Hollins           AL 35082',
  'Holly Pond        AL 35083',
  'Hollytree         AL 35751',
  'Hollywood         AL 35752',
  'Honoraville       AL 36042',
  'Hope Hull         AL 36043',
  'Horton            AL 35980',
  'Houston           AL 35572',
  'Huntsville        AL 35800',
  'Huntsville        AL 35801',
  'Huntsville        AL 35802',
  'Huntsville        AL 35803',
  'Huntsville        AL 35804',
  'Huntsville        AL 35805',
  'Huntsville        AL 35806',
  'Huntsville        AL 35807',
  'Huntsville        AL 35808',
  'Huntsville        AL 35809',
  'Huntsville        AL 35810',
  'Huntsville        AL 35811',
  'Huntsville        AL 35812',
  'Huntsville        AL 35813',
  'Huntsville        AL 35814',
  'Huntsville        AL 35815',
  'Huntsville        AL 35816',
  'Huntsville        AL 35896',
  'Huntsville        AL 35897',
  'Huntsville        AL 35898',
  'Huntsville        AL 35899',
  'Hurtsboro         AL 36860',
  'Huxford           AL 36543',
  'Ider              AL 35981',
  'Irvington         AL 36544',
  'Jachin            AL 36910',
  'Jack              AL 36346',
  'Jackson           AL 36515',
  'Jackson           AL 36545',
  'Jacksons Gap      AL 36861',
  'Jacksonville      AL 36265',
  'Jasper            AL 35501',
  'Jasper            AL 35502',
  'Jefferson         AL 36745',
  'Jemison           AL 35085',
  'Jones             AL 36749',
  'Joppa             AL 35087',
  'Kansas            AL 35573',
  'Kellerman         AL 35468',
  'Kellyton          AL 35089',
  'Kennedy           AL 35574',
  'Kent              AL 36045',
  'Killen            AL 35645',
  'Kimberly          AL 35091',
  'Kinston           AL 36453',
  'Knoxville         AL 35469',
  'Laceys Spring     AL 35754',
  'Lafayette         AL 36862',
  'Lamison           AL 36747',
  'Lanett            AL 36863',
  'Langston          AL 35755',
  'Lapine            AL 36046',
  'Lavaca            AL 36911',
  'Lawley            AL 36793',
  'Leeds             AL 35094',
  'Leesburg          AL 35983',
  'Leighton          AL 35646',
  'Lenox             AL 36454',
  'Leroy             AL 36548',
  'Lester            AL 35647',
  'Letohatchee       AL 36047',
  'Lexington         AL 35648',
  'Lillian           AL 36549',
  'Lincoln           AL 35096',
  'Linden            AL 36748',
  'Lineville         AL 36266',
  'Lisman            AL 36906',
  'Lisman            AL 36912',
  'Little River      AL 36550',
  'Livingston        AL 35470',
  'Loachapoka        AL 36865',
  'Lockhart          AL 36455',
  'Locust Fork       AL 35097',
  'Logan             AL 35098',
  'Louisville        AL 36048',
  'Lower Peach Tree  AL 36751',
  'Lowndesboro       AL 36752',
  'Lowndesboro       AL 36774',
  'Loxley            AL 36551',
  'Luverne           AL 36049',
  'Lynn              AL 35575',
  'Madison           AL 35758',
  'Magazine          AL 36554',
  'Magnolia          AL 36754',
  'Magnolia Springs  AL 36555',
  'Malcolm           AL 36556',
  'Mantua            AL 35472',
  'Maplesville       AL 36750',
  'Marbury           AL 36051',
  'Margaret          AL 35112',
  'Marion            AL 36756',
  'Marion Junction   AL 36759',
  'Mathews           AL 36052',
  'Maylene           AL 35114',
  'Mc Calla          AL 35111',
  'Mc Cullough       AL 36552',
  'Mc Intosh         AL 36553',
  'Mc Kenzie         AL 36456',
  'Mc Shan           AL 35471',
  'Mc Williams       AL 36753',
  'Megargel          AL 36457',
  'Melvin            AL 36913',
  'Mentone           AL 35984',
  'Meridianville     AL 35759',
  'Mexia             AL 36458',
  'Midland City      AL 36350',
  'Midway            AL 36053',
  'Millbrook         AL 36054',
  'Millers Ferry     AL 36760',
  'Millerville       AL 36267',
  'Millport          AL 35576',
  'Millry            AL 36558',
  'Minter            AL 36761',
  'Mobile            AL 36600',
  'Mobile            AL 36601',
  'Mobile            AL 36602',
  'Mobile            AL 36603',
  'Mobile            AL 36604',
  'Mobile            AL 36605',
  'Mobile            AL 36606',
  'Mobile            AL 36607',
  'Mobile            AL 36608',
  'Mobile            AL 36609',
  'Mobile            AL 36610',
  'Mobile            AL 36611',
  'Mobile            AL 36612',
  'Mobile            AL 36613',
  'Mobile            AL 36614',
  'Mobile            AL 36615',
  'Mobile            AL 36616',
  'Mobile            AL 36617',
  'Mobile            AL 36618',
  'Mobile            AL 36619',
  'Mobile            AL 36621',
  'Mobile            AL 36622',
  'Mobile            AL 36623',
  'Mobile            AL 36624',
  'Mobile            AL 36625',
  'Mobile            AL 36626',
  'Mobile            AL 36628',
  'Mobile            AL 36629',
  'Mobile            AL 36630',
  'Mobile            AL 36631',
  'Mobile            AL 36633',
  'Mobile            AL 36652',
  'Mobile            AL 36660',
  'Mobile            AL 36685',
  'Mobile            AL 36688',
  'Mobile            AL 36689',
  'Mobile            AL 36690',
  'Mobile            AL 36691',
  'Monroeville       AL 36460',
  'Monroeville       AL 36461',
  'Monroeville       AL 36462',
  'Montevallo        AL 35115',
  'Montgomery        AL 36100',
  'Montgomery        AL 36101',
  'Montgomery        AL 36102',
  'Montgomery        AL 36103',
  'Montgomery        AL 36104',
  'Montgomery        AL 36105',
  'Montgomery        AL 36106',
  'Montgomery        AL 36107',
  'Montgomery        AL 36108',
  'Montgomery        AL 36109',
  'Montgomery        AL 36110',
  'Montgomery        AL 36111',
  'Montgomery        AL 36112',
  'Montgomery        AL 36113',
  'Montgomery        AL 36114',
  'Montgomery        AL 36115',
  'Montgomery        AL 36116',
  'Montgomery        AL 36117',
  'Montgomery        AL 36118',
  'Montgomery        AL 36119',
  'Montgomery        AL 36120',
  'Montgomery        AL 36121',
  'Montgomery        AL 36123',
  'Montgomery        AL 36130',
  'Montgomery        AL 36133',
  'Montgomery        AL 36134',
  'Montgomery        AL 36135',
  'Montgomery        AL 36136',
  'Montgomery        AL 36140',
  'Montgomery        AL 36141',
  'Montgomery        AL 36142',
  'Montgomery        AL 36192',
  'Montgomery        AL 36193',
  'Montgomery        AL 36194',
  'Montgomery        AL 36195',
  'Montgomery        AL 36196',
  'Montgomery        AL 36197',
  'Montgomery        AL 36198',
  'Montgomery        AL 36199',
  'Montrose          AL 36559',
  'Mooresville       AL 35649',
  'Morris            AL 35116',
  'Morvin            AL 36762',
  'Moulton           AL 35650',
  'Moundville        AL 35474',
  'Mount Hope        AL 35651',
  'Mount Meigs       AL 36057',
  'Mount Olive       AL 35117',
  'Mount Vernon      AL 36560',
  'Mulga             AL 35118',
  'Munford           AL 36268',
  'Muscadine         AL 36269',
  'Myrtlewood        AL 36763',
  'Nanafalia         AL 36764',
  'Natural Bridge    AL 35577',
  'Nauvoo            AL 35578',
  'Needham           AL 36915',
  'New Brockton      AL 36351',
  'New Castle        AL 35119',
  'New Hope          AL 35760',
  'New Market        AL 35761',
  'Newbern           AL 36765',
  'Newell            AL 36270',
  'Newton            AL 36352',
  'Newville          AL 36353',
  'Normal            AL 35762',
  'Northport         AL 35476',
  'Notasulga         AL 36866',
  'Oak Hill          AL 36766',
  'Oakman            AL 35579',
  'Odenville         AL 35120',
  'Ohatchee          AL 36271',
  'Oneonta           AL 35121',
  'Opelika           AL 36801',
  'Opelika           AL 36802',
  'Opelika           AL 36803',
  'Opp               AL 36467',
  'Orange Beach      AL 36561',
  'Orrville          AL 36767',
  'Owens Cross Roads AL 35763',
  'Ozark             AL 36360'
]
export default zipCodes
