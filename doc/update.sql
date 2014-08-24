ALTER TABLE `fitment-erp`.`privilege` ADD COLUMN `cid` INT(11) NOT NULL DEFAULT 0 COMMENT 'company id' AFTER `sname`;
ALTER TABLE `fitment-erp`.`privilege` DROP INDEX `unique`,ADD UNIQUE INDEX `unique` USING BTREE(`sid`, `gid`, `uid`, `cid`);

ALTER TABLE `fitment-erp`.`company` CHANGE COLUMN `telphone` `telephone` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL;
