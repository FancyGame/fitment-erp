ALTER TABLE `fitment-erp`.`privilege` ADD COLUMN `cid` INT(11) NOT NULL DEFAULT 0 COMMENT 'company id' AFTER `sname`;
ALTER TABLE `fitment-erp`.`privilege` DROP INDEX `unique`,ADD UNIQUE INDEX `unique` USING BTREE(`sid`, `gid`, `uid`, `cid`);

ALTER TABLE `fitment-erp`.`company` CHANGE COLUMN `telphone` `telephone` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL;

CREATE TABLE `message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `from_uid` varchar(45) NOT NULL,
  `to_uid` varchar(45) NOT NULL,
  `content` varchar(500) NOT NULL DEFAULT '',
  `urgency_level` int(10) unsigned NOT NULL DEFAULT '1',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `del` int(10) unsigned NOT NULL DEFAULT '0',
  `createon` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateon` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
CREATE TABLE `urgency_level` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cid` int(11) DEFAULT '0',
  `name` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

  insert into urgency_level values(1,0,"普通");
  insert into urgency_level values(2,0,"优先");
  insert into urgency_level values(3,0,"紧急");
  insert into urgency_level values(4,0,"立即");
