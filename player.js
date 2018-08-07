function player(level=0, id="", desc="", first_comment="", second_comment="", country="", rank=0) {
	this.level = level;
    this.id = id;
    this.desc = desc;
    this.first_comment = first_comment;
    this.second_comment = second_comment;
    this.country = country;
    this.rank = rank;
    this.achievment_rank = "";
    this.name = "";
}
player.prototype.update = function(data) {
    this.level = data.level;
    this.id = data.id;
    this.desc = data.desc;
    this.first_comment = data.comm.first_comment;
    this.second_comment = data.comm.second_comment;
    this.country = data.country;
    if(data.rank != undefined) this.rank = data.rank;
    if(data.achievment_rank != undefined) this.achievment_rank = data.achievment_rank;
    if(data.name != undefined) this.name = data.name;
};
