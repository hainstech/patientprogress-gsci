import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Form from '@rjsf/material-ui';
import { InputLabel, NativeSelect } from '@material-ui/core';
import ImageMapper from 'react-img-mapper';

import URL from '../../assets/img/bodyMap.jpg';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardBody from '../../components/Card/CardBody.js';

import { getCurrentProfile } from '../../actions/profile';

import {
  getQuestionnaire,
  addQuestionnaire,
} from '../../actions/questionnaire';
import Spinner from '../../components/Spinner/Spinner';

const BodyMap = (props) => {
  // eslint-disable-next-line
  const [regions, setRegions] = useState([]);

  const handleClick = (id) => {
    const newId = id.toString();
    setRegions((regions) => {
      let newArray;
      if (!regions.includes(newId)) {
        newArray = [...regions, newId];
      } else {
        newArray = regions.filter((region) => region !== newId);
      }
      props.onChange(newArray);
      return newArray;
    });
  };

  return (
    <>
      <strong>{props.schema.description}</strong>
      <ImageMapper
        src={URL}
        map={{
          name: 'body-map',
          areas: [
            {
              id: '1',
              title: '1',
              shape: 'poly',
              name: '1',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                297, 175, 298, 349, 281, 349, 274, 342, 268, 335, 258, 325, 251,
                316, 251, 306, 240, 303, 235, 295, 233, 285, 225, 270, 225, 261,
                227, 253, 233, 248, 231, 240, 233, 226, 234, 215, 240, 203, 249,
                190, 257, 185, 268, 180, 277, 175, 289, 172,
              ],
            },
            {
              id: '2',
              title: '2',
              shape: 'poly',
              name: '2',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                302, 173, 302, 351, 314, 348, 323, 342, 332, 337, 337, 331, 343,
                328, 349, 323, 352, 313, 360, 301, 368, 295, 370, 287, 373, 280,
                376, 270, 377, 262, 375, 255, 365, 251, 360, 243, 364, 233, 367,
                223, 365, 208, 360, 198, 353, 193, 346, 185, 337, 180, 325, 176,
                313, 173,
              ],
            },
            {
              id: '3',
              title: '3',
              shape: 'poly',
              name: '3',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                181, 394, 421, 394, 399, 378, 384, 372, 372, 365, 358, 357, 349,
                350, 347, 342, 347, 332, 338, 333, 328, 341, 320, 346, 309, 349,
                298, 350, 289, 350, 282, 349, 274, 342, 269, 336, 262, 329, 253,
                324, 252, 333, 251, 344, 246, 359, 236, 364, 221, 373, 208, 380,
              ],
            },
            {
              id: '4',
              title: '4',
              shape: 'poly',
              name: '4',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                297, 398, 299, 490, 112, 493, 108, 481, 106, 470, 106, 460, 108,
                451, 111, 438, 118, 429, 124, 416, 138, 408, 147, 401, 162, 395,
              ],
            },
            {
              id: '5',
              title: '5',
              shape: 'poly',
              name: '5',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                300, 399, 300, 489, 500, 488, 498, 476, 496, 466, 496, 457, 493,
                446, 489, 437, 486, 425, 477, 416, 467, 408, 456, 402, 444, 399,
                431, 394,
              ],
            },
            {
              id: '6',
              title: '6',
              shape: 'poly',
              name: '6',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                168, 637, 104, 631, 103, 596, 102, 583, 104, 568, 105, 552, 106,
                535, 108, 520, 110, 502, 110, 494, 168, 493, 173, 509, 175, 524,
                177, 543, 181, 555, 181, 570, 181, 585, 184, 600, 185, 612, 179,
                622,
              ],
            },
            {
              id: '7',
              title: '7',
              shape: 'poly',
              name: '7',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                441, 491, 435, 500, 431, 509, 432, 518, 433, 530, 432, 542, 432,
                555, 432, 570, 431, 586, 431, 597, 431, 607, 438, 619, 442, 627,
                500, 617, 504, 586, 505, 568, 505, 555, 501, 544, 498, 527, 495,
                514, 496, 502, 500, 491,
              ],
            },
            {
              id: '8',
              title: '8',
              shape: 'poly',
              name: '8',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                107, 630, 169, 640, 168, 662, 165, 689, 160, 708, 157, 730, 155,
                752, 147, 769, 139, 788, 134, 806, 127, 820, 125, 828, 75, 823,
                76, 800, 81, 779, 85, 756, 87, 729, 86, 705, 91, 677, 96, 652,
              ],
            },
            {
              id: '9',
              title: '9',
              shape: 'poly',
              name: '9',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                435, 628, 507, 617, 523, 651, 530, 692, 530, 730, 532, 753, 534,
                770, 542, 787, 549, 821, 495, 846, 491, 817, 478, 790, 463, 756,
                454, 726, 443, 707, 438, 686, 435, 653,
              ],
            },
            {
              id: '10',
              title: '10',
              shape: 'poly',
              name: '10',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                74, 826, 63, 839, 48, 853, 41, 868, 34, 883, 28, 901, 41, 902,
                55, 885, 55, 900, 52, 916, 57, 935, 61, 942, 72, 943, 82, 946,
                93, 940, 106, 933, 117, 926, 122, 910, 127, 894, 132, 878, 130,
                864, 131, 851, 128, 839, 123, 829,
              ],
            },
            {
              id: '11',
              title: '11',
              shape: 'poly',
              name: '11',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                495, 847, 550, 824, 569, 839, 577, 849, 584, 862, 591, 877, 599,
                885, 602, 895, 595, 901, 576, 893, 575, 909, 575, 919, 573, 930,
                566, 938, 555, 947, 543, 948, 530, 944, 523, 933, 513, 924, 505,
                910, 501, 897, 496, 880, 494, 867, 493, 856,
              ],
            },
            {
              id: '12',
              title: '12',
              shape: 'poly',
              name: '12',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                170, 494, 297, 494, 297, 545, 265, 586, 257, 598, 251, 610, 246,
                621, 239, 628, 233, 640, 228, 649, 217, 661, 207, 670, 195, 665,
                189, 660, 189, 632, 188, 615, 182, 597,
              ],
            },
            {
              id: '13',
              title: '13',
              shape: 'poly',
              name: '13',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                300, 494, 438, 492, 430, 503, 432, 514, 433, 523, 430, 537, 432,
                554, 431, 569, 431, 582, 430, 600, 430, 615, 424, 626, 422, 640,
                422, 651, 413, 657, 397, 662, 387, 654, 377, 645, 371, 639, 365,
                630, 355, 614, 345, 600, 334, 582, 325, 572, 314, 558, 306, 550,
                300, 545,
              ],
            },
            {
              id: '14',
              title: '14',
              shape: 'poly',
              name: '14',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                298, 550, 299, 787, 245, 788, 222, 770, 203, 755, 189, 741, 179,
                731, 183, 657, 199, 671, 220, 661, 230, 642, 252, 605, 266, 581,
                279, 558,
              ],
            },
            {
              id: '15',
              title: '15',
              shape: 'poly',
              name: '15',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                301, 548, 301, 786, 351, 787, 430, 723, 434, 696, 430, 665, 425,
                654, 405, 663, 386, 658, 373, 642, 337, 591, 319, 564, 311, 553,
              ],
            },
            {
              id: '16',
              title: '16',
              shape: 'poly',
              name: '16',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                248, 788, 351, 788, 336, 808, 326, 822, 313, 832, 298, 839, 288,
                839, 278, 830, 264, 811,
              ],
            },
            {
              id: '17',
              title: '17',
              shape: 'poly',
              name: '17',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                175, 735, 170, 768, 162, 793, 163, 815, 163, 838, 164, 871, 165,
                893, 168, 920, 173, 952, 180, 988, 186, 1015, 190, 1035, 193,
                1064, 198, 1087, 197, 1103, 278, 1107, 280, 1065, 280, 1050,
                282, 1016, 281, 993, 283, 969, 287, 955, 291, 935, 296, 915,
                296, 898, 295, 880, 292, 865, 289, 851, 283, 839, 272, 823, 258,
                804, 242, 786, 220, 770,
              ],
            },
            {
              id: '18',
              title: '18',
              shape: 'poly',
              name: '18',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                403, 1108, 316, 1108, 310, 1080, 311, 1054, 310, 1035, 307,
                1011, 306, 992, 304, 975, 304, 954, 302, 941, 301, 930, 302,
                916, 300, 895, 299, 854, 301, 846, 320, 829, 336, 810, 349, 794,
                370, 776, 387, 763, 409, 745, 431, 729, 445, 744, 453, 768, 453,
                784, 451, 815, 450, 837, 447, 873, 444, 907, 441, 928, 434, 954,
                423, 1001, 417, 1013, 412, 1026, 402, 1044, 405, 1058, 408,
                1069, 409, 1085, 408, 1094,
              ],
            },
            {
              id: '19',
              title: '19',
              shape: 'poly',
              name: '19',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                198, 1105, 278, 1106, 273, 1129, 277, 1145, 282, 1159, 286,
                1172, 288, 1190, 288, 1202, 287, 1216, 282, 1231, 280, 1247,
                278, 1257, 273, 1268, 270, 1284, 269, 1296, 268, 1320, 266,
                1338, 266, 1356, 271, 1372, 274, 1383, 275, 1390, 262, 1389,
                251, 1391, 234, 1389, 224, 1391, 217, 1386, 216, 1374, 217,
                1363, 217, 1350, 215, 1334, 209, 1319, 206, 1302, 201, 1285,
                198, 1266, 195, 1243, 191, 1223, 189, 1199, 189, 1175, 188,
                1157, 191, 1139, 194, 1118,
              ],
            },
            {
              id: '20',
              title: '20',
              shape: 'poly',
              name: '20',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                316, 1109, 403, 1107, 403, 1133, 408, 1147, 412, 1163, 413,
                1176, 412, 1197, 409, 1223, 406, 1239, 405, 1252, 402, 1266,
                399, 1277, 397, 1295, 395, 1309, 393, 1326, 388, 1344, 385,
                1361, 382, 1379, 389, 1402, 324, 1402, 324, 1374, 329, 1352,
                326, 1332, 325, 1311, 324, 1295, 323, 1275, 320, 1258, 315,
                1238, 309, 1213, 310, 1188, 315, 1161, 319, 1140,
              ],
            },
            {
              id: '21',
              title: '21',
              shape: 'poly',
              name: '21',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                219, 1393, 274, 1392, 275, 1409, 280, 1422, 278, 1436, 269,
                1438, 260, 1444, 251, 1448, 239, 1455, 233, 1462, 229, 1471,
                212, 1481, 203, 1483, 193, 1484, 186, 1486, 170, 1490, 159,
                1489, 149, 1487, 140, 1480, 136, 1473, 140, 1461, 146, 1448,
                154, 1442, 167, 1437, 177, 1436, 190, 1424, 200, 1410, 209,
                1402,
              ],
            },
            {
              id: '22',
              title: '22',
              shape: 'poly',
              name: '22',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                326, 1404, 388, 1404, 400, 1415, 403, 1425, 411, 1433, 421,
                1437, 434, 1445, 442, 1452, 444, 1460, 442, 1469, 439, 1478,
                434, 1484, 423, 1489, 407, 1489, 393, 1488, 380, 1487, 362,
                1479, 351, 1465, 342, 1454, 334, 1451, 328, 1444, 322, 1436,
                319, 1422, 320, 1415,
              ],
            },
            {
              id: '23',
              title: '23',
              shape: 'poly',
              name: '23',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                985, 171, 994, 314, 968, 314, 951, 306, 938, 300, 931, 303, 924,
                298, 917, 286, 911, 270, 910, 255, 921, 262, 919, 251, 915, 239,
                915, 229, 915, 214, 921, 199, 931, 189, 944, 179, 966, 175, 975,
                171,
              ],
            },
            {
              id: '24',
              title: '24',
              shape: 'poly',
              name: '24',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                988, 170, 995, 316, 1029, 313, 1044, 303, 1049, 298, 1058, 303,
                1063, 297, 1071, 285, 1074, 277, 1075, 270, 1071, 259, 1067,
                253, 1060, 257, 1063, 243, 1065, 232, 1066, 220, 1062, 209,
                1057, 199, 1051, 188, 1040, 180, 1026, 173, 1012, 170, 1001,
                169,
              ],
            },
            {
              id: '25',
              title: '25',
              shape: 'poly',
              name: '25',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1119, 382, 864, 384, 886, 368, 904, 360, 921, 353, 933, 345,
                936, 330, 938, 302, 952, 311, 968, 313, 977, 315, 992, 315,
                1004, 316, 1012, 315, 1024, 314, 1030, 313, 1037, 309, 1043,
                304, 1047, 323, 1047, 336, 1055, 349, 1067, 354, 1077, 358,
                1085, 364, 1093, 368, 1104, 371,
              ],
            },
            {
              id: '26',
              title: '26',
              shape: 'poly',
              name: '26',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                858, 386, 992, 386, 992, 427, 974, 428, 961, 430, 949, 434, 933,
                436, 920, 443, 907, 449, 888, 463, 879, 471, 866, 479, 857, 482,
                840, 487, 827, 488, 815, 488, 804, 488, 793, 487, 786, 487, 786,
                475, 788, 464, 790, 457, 792, 444, 792, 436, 796, 427, 799, 414,
                808, 403, 822, 395, 837, 390,
              ],
            },
            {
              id: '27',
              title: '27',
              shape: 'poly',
              name: '27',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1122, 384, 992, 384, 993, 425, 1005, 427, 1020, 429, 1035, 432,
                1049, 434, 1064, 440, 1072, 447, 1083, 454, 1095, 464, 1102,
                470, 1116, 480, 1130, 485, 1148, 489, 1164, 489, 1181, 490,
                1185, 480, 1189, 470, 1188, 452, 1185, 440, 1182, 428, 1178,
                418, 1170, 407, 1160, 399, 1148, 393, 1138, 387,
              ],
            },
            {
              id: '28',
              title: '28',
              shape: 'poly',
              name: '28',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                854, 618, 787, 600, 786, 586, 788, 574, 790, 563, 789, 551, 790,
                536, 788, 526, 788, 511, 783, 493, 784, 487, 800, 488, 812, 488,
                821, 488, 840, 487, 849, 516, 850, 533, 851, 544, 853, 561, 858,
                578, 859, 591, 857, 608,
              ],
            },
            {
              id: '29',
              title: '29',
              shape: 'poly',
              name: '29',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1136, 491, 1185, 489, 1183, 504, 1185, 516, 1188, 527, 1191,
                547, 1190, 566, 1192, 578, 1190, 600, 1175, 609, 1158, 615,
                1140, 624, 1125, 635, 1115, 637, 1114, 628, 1115, 613, 1118,
                601, 1118, 588, 1120, 575, 1121, 553, 1125, 529, 1128, 514,
                1131, 499,
              ],
            },
            {
              id: '30',
              title: '30',
              shape: 'poly',
              name: '30',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                788, 601, 854, 619, 851, 648, 845, 667, 841, 684, 837, 695, 834,
                708, 831, 723, 824, 737, 817, 750, 816, 760, 812, 774, 808, 785,
                805, 794, 801, 808, 801, 814, 787, 810, 778, 806, 770, 805, 760,
                802, 754, 800, 755, 784, 754, 767, 757, 748, 756, 731, 757, 706,
                762, 677, 766, 649, 775, 624,
              ],
            },
            {
              id: '31',
              title: '31',
              shape: 'poly',
              name: '31',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1114, 640, 1187, 604, 1187, 624, 1196, 646, 1198, 660, 1200,
                675, 1203, 690, 1206, 701, 1203, 714, 1201, 730, 1201, 755,
                1202, 777, 1206, 799, 1209, 812, 1157, 822, 1156, 804, 1151,
                786, 1146, 770, 1143, 757, 1138, 748, 1131, 726, 1125, 703,
                1119, 669,
              ],
            },
            {
              id: '32',
              title: '32',
              shape: 'poly',
              name: '32',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                796, 812, 798, 823, 799, 835, 799, 857, 797, 875, 790, 890, 780,
                913, 774, 921, 765, 927, 754, 934, 734, 930, 725, 921, 721, 884,
                701, 895, 697, 886, 700, 867, 714, 849, 721, 837, 730, 824, 742,
                813, 750, 800,
              ],
            },
            {
              id: '33',
              title: '33',
              shape: 'poly',
              name: '33',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1155, 827, 1208, 815, 1214, 827, 1223, 832, 1229, 841, 1237,
                856, 1243, 869, 1249, 883, 1252, 894, 1240, 899, 1223, 876,
                1224, 889, 1223, 902, 1220, 925, 1216, 934, 1208, 942, 1197,
                939, 1189, 942, 1183, 934, 1178, 926, 1170, 926, 1165, 912,
                1158, 899, 1155, 888, 1149, 875, 1147, 863, 1149, 841,
              ],
            },
            {
              id: '34',
              title: '34',
              shape: 'poly',
              name: '34',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                991, 592, 989, 428, 959, 432, 934, 438, 919, 444, 907, 451, 890,
                463, 871, 473, 860, 481, 842, 487, 846, 514, 850, 544, 853, 573,
                858, 595, 863, 615, 867, 637, 890, 639, 919, 634, 941, 624, 966,
                607,
              ],
            },
            {
              id: '35',
              title: '35',
              shape: 'poly',
              name: '35',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                993, 428, 991, 590, 1014, 604, 1032, 617, 1048, 628, 1065, 633,
                1086, 636, 1110, 640, 1114, 604, 1119, 578, 1121, 548, 1128,
                512, 1136, 491, 1113, 479, 1092, 460, 1076, 448, 1056, 437,
                1030, 432,
              ],
            },
            {
              id: '36',
              title: '36',
              shape: 'poly',
              name: '36',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                987, 596, 989, 742, 973, 724, 955, 716, 937, 713, 919, 712, 907,
                713, 893, 715, 878, 720, 863, 725, 850, 735, 850, 721, 852, 704,
                858, 681, 861, 662, 863, 637, 895, 637, 915, 635, 934, 628, 960,
                612,
              ],
            },
            {
              id: '37',
              title: '37',
              shape: 'poly',
              name: '37',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                991, 590, 992, 740, 1006, 723, 1031, 717, 1069, 715, 1091, 722,
                1103, 726, 1119, 739, 1128, 755, 1128, 732, 1124, 717, 1124,
                704, 1122, 687, 1117, 666, 1113, 641, 1082, 640, 1056, 633,
              ],
            },
            {
              id: '38',
              title: '38',
              shape: 'poly',
              name: '38',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                987, 743, 988, 762, 989, 787, 987, 822, 980, 832, 970, 841, 951,
                844, 922, 845, 893, 844, 862, 835, 837, 828, 834, 806, 836, 781,
                842, 759, 851, 734, 872, 719, 897, 712, 938, 711, 969, 720, 979,
                728,
              ],
            },
            {
              id: '39',
              title: '39',
              shape: 'poly',
              name: '39',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                991, 741, 993, 777, 991, 799, 991, 822, 997, 837, 1015, 845,
                1035, 846, 1067, 845, 1099, 839, 1128, 828, 1134, 792, 1134,
                766, 1127, 750, 1114, 735, 1091, 720, 1060, 716, 1029, 717,
                1007, 723,
              ],
            },
            {
              id: '40',
              title: '40',
              shape: 'poly',
              name: '40',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                970, 1105, 870, 1106, 863, 1069, 867, 1039, 866, 1017, 858, 994,
                849, 948, 841, 889, 836, 830, 896, 844, 930, 845, 961, 844, 987,
                830, 988, 858, 980, 924, 973, 960, 971, 1000, 978, 1032, 978,
                1062, 974, 1085,
              ],
            },
            {
              id: '41',
              title: '41',
              shape: 'poly',
              name: '41',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1011, 1103, 1092, 1103, 1102, 1079, 1101, 1054, 1102, 1037,
                1117, 997, 1125, 958, 1133, 921, 1133, 878, 1130, 831, 1113,
                835, 1081, 842, 1051, 846, 1027, 847, 991, 838, 989, 855, 987,
                885, 992, 945, 1000, 983, 1002, 1023, 1002, 1080,
              ],
            },
            {
              id: '42',
              title: '42',
              shape: 'poly',
              name: '42',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                871, 1109, 969, 1111, 975, 1163, 977, 1207, 968, 1247, 964,
                1278, 961, 1303, 959, 1330, 959, 1352, 965, 1379, 966, 1393,
                897, 1389, 896, 1346, 886, 1297, 884, 1265, 867, 1220, 863,
                1187, 867, 1149,
              ],
            },
            {
              id: '43',
              title: '43',
              shape: 'poly',
              name: '43',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1013, 1105, 1099, 1105, 1105, 1151, 1108, 1184, 1102, 1230,
                1092, 1273, 1084, 1306, 1076, 1350, 1074, 1388, 1010, 1391,
                1007, 1380, 1015, 1364, 1018, 1330, 1013, 1296, 1013, 1247,
                1006, 1223, 1002, 1196, 1010, 1162, 1023, 1132,
              ],
            },
            {
              id: '44',
              title: '44',
              shape: 'poly',
              name: '44',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                959, 1394, 895, 1391, 879, 1408, 863, 1417, 852, 1420, 848,
                1426, 868, 1436, 884, 1441, 896, 1444, 912, 1455, 940, 1455,
                957, 1454, 969, 1441, 968, 1422,
              ],
            },
            {
              id: '45',
              title: '45',
              shape: 'poly',
              name: '45',
              fillColor: '#ff00004d',
              strokeColor: 'black',
              coords: [
                1012, 1393, 1009, 1417, 1005, 1433, 1019, 1444, 1042, 1448,
                1063, 1442, 1087, 1439, 1109, 1439, 1120, 1434, 1136, 1430,
                1136, 1422, 1125, 1415, 1112, 1408, 1094, 1393, 1081, 1386,
              ],
            },
          ],
        }}
        responsive
        parentWidth={400}
        stayHighlighted
        stayMultiHighlighted
        toggleHighlighted
        onClick={(area) => handleClick(area.id)}
        onLoad={() => {}}
      />
    </>
  );
};

const NativeSelectWidget = function (props) {
  const handleChange = (event) => {
    const value = event.target.value;
    props.onChange(value);
  };

  return (
    <>
      <InputLabel shrink htmlFor={props.label}>
        {props.label}
      </InputLabel>
      <NativeSelect
        value={props.value}
        onChange={handleChange}
        inputProps={{
          name: props.id,
          id: props.label,
        }}
      >
        {!props.default && <option aria-label='None' value='' />}

        {props.options.enumOptions.map(({ label, value }) => (
          <option key={`${label}`} value={value}>
            {label}
          </option>
        ))}
      </NativeSelect>
    </>
  );
};

function Questionnaire({
  getQuestionnaire,
  addQuestionnaire,
  getCurrentProfile,
  match,
  history,
}) {
  const [questionnaire, setQuestionnaire] = useState(null);

  useEffect(() => {
    (async () => {
      const questionnaire = await getQuestionnaire(match.params.id);
      setQuestionnaire(questionnaire);
    })();
  }, [getQuestionnaire, match.params.id]);

  const onSubmit = async (e) => {
    await addQuestionnaire(
      history,
      match.params.id,
      questionnaire.title,
      formData
    );
    await getCurrentProfile('patient');
  };

  const [formData, setFormData] = useState(null);

  const widgets = {
    nativeSelect: NativeSelectWidget,
  };

  const fields = {
    bodyMap: BodyMap,
  };

  return (
    <Fragment>
      {questionnaire === null ? (
        <Spinner />
      ) : (
        <GridContainer justifyContent='center'>
          <GridItem xs={12}>
            <Card>
              <CardBody>
                <Form
                  widgets={widgets}
                  fields={fields}
                  schema={questionnaire.schema}
                  uiSchema={questionnaire.uischema}
                  formData={formData}
                  onChange={(e) => setFormData(e.formData)}
                  onSubmit={(e) => onSubmit(e)}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </Fragment>
  );
}

Questionnaire.propTypes = {
  getQuestionnaire: PropTypes.func.isRequired,
  addQuestionnaire: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

export default connect(null, {
  getQuestionnaire,
  addQuestionnaire,
  getCurrentProfile,
})(withRouter(Questionnaire));
