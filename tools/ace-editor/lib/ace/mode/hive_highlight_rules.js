// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

define(function (require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

  var HiveHighlightRules = function () {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    var keywords = (
        "ADD|ADMIN|AFTER|ALL|ALTER|ANALYZE|AND|ARCHIVE|AS|ASC|AUTHORIZATION|BEFORE|BETWEEN|BOTH|BUCKET|BUCKETS|BY|CASCADE|CASE|CAST|CHANGE|CLUSTER|CLUSTERED|CLUSTERSTATUS|COLLECTION|COLUMN|COLUMNS|COMMENT|COMPACT|COMPACTIONS|COMPUTE|CONCATENATE|CONF|CONTINUE|CREATE|CROSS|CUBE|CURRENT|CURRENT_DATE|CURRENT_TIMESTAMP|CURSOR|DATA|DATABASE|DATABASES|DATETIME|DAY|DBPROPERTIES|DEFERRED|DEFINED|DELETE|DEPENDENCY|DESC|DESCRIBE|DIRECTORIES|DIRECTORY|DISABLE|DISTINCT|DISTRIBUTE|DROP|ELEM_TYPE|ELSE|ENABLE|END|ESCAPED|EXCHANGE|EXCLUSIVE|EXISTS|EXPLAIN|EXPORT|EXTENDED|EXTERNAL|FETCH|FIELDS|FILE|FILEFORMAT|FIRST|FOLLOWING|FOR|FORMAT|FORMATTED|FROM|FULL|FUNCTION|FUNCTIONS|GRANT|GROUP|GROUPING|HAVING|HOLD_DDLTIME|HOUR|IDXPROPERTIES|IF|IGNORE|IMPORT|IN|INDEX|INDEXES|INNER|INPATH|INPUTDRIVER|INPUTFORMAT|INSERT|INTERSECT|INTERVAL|INTO|IS|ITEMS|JAR|JOIN|KEYS|KEY_TYPE|LATERAL|LEFT|LESS|LIKE|LIMIT|LINES|LOAD|LOCAL|LOCATION|LOCK|LOCKS|LOGICAL|LONG|MACRO|MAPJOIN|MATERIALIZED|MINUS|MINUTE|MONTH|MORE|MSCK|NONE|NOSCAN|NOT|NO_DROP|OF|OFFLINE|ON|OPTION|OR|ORDER|OUT|OUTER|OUTPUTDRIVER|OUTPUTFORMAT|OVER|OVERWRITE|OWNER|PARTIALSCAN|PARTITION|PARTITIONED|PARTITIONS|PERCENT|PLUS|PRECEDING|PRESERVE|PRETTY|PRINCIPALS|PROCEDURE|PROTECTION|PURGE|RANGE|READ|READONLY|READS|REBUILD|RECORDREADER|RECORDWRITER|REDUCE|REGEXP|RELOAD|RENAME|REPAIR|REPLACE|RESTRICT|REVOKE|REWRITE|RIGHT|RLIKE|ROLE|ROLES|ROLLUP|ROW|ROWS|SCHEMA|SCHEMAS|SECOND|SELECT|SEMI|SERDEPROPERTIES|SERVER|SET|SETS|SHARED|SHOW|SHOW_DATABASE|SKEWED|SORT|SORTED|SSL|STATISTICS|STORED|STREAMTABLE|TABLE|TABLES|TABLESAMPLE|TBLPROPERTIES|TEMPORARY|TERMINATED|THEN|TO|TOUCH|TRANSACTIONS|TRANSFORM|TRIGGER|TRUNCATE|UNARCHIVE|UNBOUNDED|UNDO|UNION|UNIQUEJOIN|UNLOCK|UNSET|UNSIGNED|UPDATE|URI|USE|USER|USING|UTC|UTCTIMESTAMP|VALUES|VALUE_TYPE|VIEW|WHEN|WHERE|WHILE|WINDOW|WITH|YEAR"
    );

    var builtinConstants = (
        "FALSE|NULL|TRUE"
    );

    var builtinFunctions = (
        "ABS|ACOS|ADD_MONTHS|AES_DECRYPT|AES_ENCRYPT|ARRAY|ARRAY_CONTAINS|ASCII|ASIN|ATAN|AVG|BASE64|BIN|BINARY|BROUND|CAST|CBRT|CEIL|CEILING|COALESCE|COLLECT_LIST|COLLECT_SET|CONCAT|CONCAT_WS|CONTEXT_NGRAMS|CONV|CORR|COS|COVAR_POP|COVAR_SAMP|COUNT|CRC32|CREATE_UNION|CUME_DIST|CURRENT_DATABASE|CURRENT_DATE|CURRENT_TIMESTAMP|CURRENT_USER|DATE_ADD|DATE_FORMAT|DATE_SUB|DATEDIFF|DAY|DAYOFMONTH|DECODE|DEGREES|DENSE_RANK|E|ENCODE|EXP|EXPLODE|FACTORIAL|FIND_IN_SET|FIRST_VALUE|FLOOR|FORMAT_NUMBER|FROM_UNIXTIME|FROM_UTC_TIMESTAMP|GET_JSON_OBJECT|GREATEST|HASH|HEX|HISTOGRAM_NUMERIC|HOUR|IF|IN_FILE|INLINE|INSTR|INITCAP|ISNOTNULL|ISNULL|JAVA_METHOD|JSON_TUPLE|LAG|LAST_DAY|LAST_VALUE|LEAD|LEAST|LENGTH|LEVENSHTEIN|LCASE|LN|LOCATE|LOG|LOG10|LOG2|LOWER|LPAD|LTRIM|MAP|MAP_KEYS|MAP_VALUES|MAX|MD5|MIN|MINUTE|MONTH|MONTHS_BETWEEN|NAMED_STRUCT|NEGATIVE|NEXT_DAY|NGRAMS|NTILE|NVL|PARSE_URL|PARSE_URL_TUPLE|PERCENT_RANK|PERCENTILE|PERCENTILE_APPROX|PI|PMOD|POSEXPLODE|POSITIVE|POW|POWER|PRINTF|QUARTER|RADIANS|RAND|RANK|REFLECT|REGEXP_EXTRACT|REGEXP_REPLACE|REPEAT|REVERSE|ROUND|ROW_NUMBER|RPAD|RTRIM|SECOND|SHA|SHA1|SHA2|SHIFTLEFT|SHIFTRIGHT|SHIFTRIGHTUNSIGNED|SIGN|SIN|SIZE|SORT_ARRAY|SQRT|STACK|STDDEV_POP|STDDEV_SAMP|STRUCT|SENTENCES|SOUNDEX|SPACE|SPLIT|STR_TO_MAP|SUBSTR|SUBSTRING|SUBSTRING_INDEX|SUM|TAN|TO_DATE|TO_UTC_TIMESTAMP|TRANSLATE|TRIM|TRUNC|UCASE|UNBASE64|UNHEX|UNIX_TIMESTAMP|UPPER|VAR_POP|VAR_SAMP|VARIANCE|WEEKOFYEAR|XPATH|XPATH_BOOLEAN|XPATH_DOUBLE|XPATH_FLOAT|XPATH_INT|XPATH_LONG|XPATH_NUMBER|XPATH_SHORT|XPATH_STRING|YEAR"
    );

    var dataTypes = (
        "ARRAY|BIGINT|BINARY|BOOLEAN|CHAR|DATE|DECIMAL|DELIMITED|DOUBLE|FLOAT|INT|MAP|RCFILE|SEQUENCEFILE|SERDE|SMALLINT|STRING|STRUCT|TEXTFILE|TIMESTAMP|TINYINT|UNIONTYPE|VARCHAR"
    );

    var keywordMapper = this.createKeywordMapper({
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants,
        "storage.type": dataTypes
    }, "identifier", true);

    this.$rules = {
      start: [
        {
            token : "comment",
            regex : "--.*$"
        },  {
            token : "comment",
            start : "/\\*",
            end : "\\*/"
        }, {
            token : "string",           // " string
            regex : '".*?"'
        }, {
            token : "string",           // ' string
            regex : "'.*?'"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token : "paren.lparen",
            regex : "[\\(]"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        }, {
            token : "text",
            regex : "\\s+"
        }
      ]
    };

    this.normalizeRules();
  };

  HiveHighlightRules.metaData = {
    fileTypes: ["hql", "q", "ql"],
    name: "Hive",
    scopeName: "source.hive"
  };

  oop.inherits(HiveHighlightRules, TextHighlightRules);

  exports.HiveHighlightRules = HiveHighlightRules;
});