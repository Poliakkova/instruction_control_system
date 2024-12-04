create table instructions
(
    id          uuid,
    instruction_title        varchar(255),
    instruction_head_surname        varchar(200),
    instruction_head_name        varchar(200),
    instruction_head_patronymic        varchar(200),
    instruction_head_control_surname        varchar(200),
    instruction_head_control_name        varchar(200),
    instruction_head_control_patronymic       varchar(200),
    instruction_status       varchar(50),
    instruction_source_of_instruction       varchar(200),
    instruction_short_description        varchar(255),
    instruction_full_description        varchar(510),
    instruction_text        varchar(4000),
    start_time   bigint,
    exp_time   bigint
)