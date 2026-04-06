// src/types/doc-config.ts

export interface MarginConfig {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface FontConfig {
  name: string;
  size: number;
  tolerance: number;
}

export interface IndentRulesConfig {
  tolerance: number;
  main_heading_num: number;
  main_heading_text: number;
  sub_heading_num: number;
  sub_heading_text_1: number;
  sub_heading_text_2: number;
  sub_heading_text_3: number;
  list_item_num: number;
  list_item_text_1: number;
  list_item_text_2: number;
  bullet_point: number;
  bullet_text: number;
  para_indent: number;
  dash_indent: number;
  dash_text: number;
  para_min_detect: number;
  para_max_detect: number;
}

export interface CheckListConfig {
  check_font: boolean;
  check_margin: boolean;
  check_section_seq: boolean;
  check_page_seq: boolean;
  check_indentation: boolean;
  check_spacing: boolean;
  check_paper_size: boolean;
}

export interface DocumentConfigData {
  margin_mm: MarginConfig;
  font: FontConfig;
  indent_rules: IndentRulesConfig;
  check_list: CheckListConfig;
  ignored_units: string[];
}