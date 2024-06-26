import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // await sql`DROP TABLE name_of_the_table`;
  //Create all tables if they don`t exist

  try {
    const credentials = await sql`CREATE TABLE IF NOT EXISTS credentials (
              credential_id SERIAL PRIMARY KEY,
              user_id INT REFERENCES users(user_id),
              username VARCHAR(50) UNIQUE,
              email VARCHAR(255) UNIQUE,
              password_hash VARCHAR(255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;

    const users = await sql`CREATE TABLE IF NOT EXISTS users (
              user_id SERIAL PRIMARY KEY,
              admin_id INT REFERENCES users(user_id),  
              seller_id INT REFERENCES users(user_id), 
              name VARCHAR(100),
              wallet NUMERIC(15),
              phone VARCHAR(15),
              pix VARCHAR(50),
              isComissionPercentual BOOLEAN,
              comissionValue NUMERIC(5),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              
              CONSTRAINT check_comission CHECK (
                  (isComissionPercentual IS NOT NULL AND comissionValue IS NOT NULL) OR
                  (isComissionPercentual IS NULL AND comissionValue IS NULL)
              ));`;

    const lotteries = await sql`CREATE TABLE IF NOT EXISTS lotteries (
              id BIGSERIAL PRIMARY KEY,
              name VARCHAR(20) NOT NULL,
              color VARCHAR(20) NOT NULL);`;

    const bets = await sql`CREATE TABLE IF NOT EXISTS bets (
              user_id BIGINT NOT NULL,
              bet_numbers CHAR(20)[] NOT NULL,
              lottery_code BIGINT NOT NULL,
              lottery_number BIGINT,
              create_on VARCHAR(250),
              result CHAR(20)[],
              bet_id BIGINT NOT NULL,
              CONSTRAINT bets_pkey PRIMARY KEY (bet_id));`;

    const modalidades_caixa = await sql`CREATE TABLE IF NOT EXISTS modalidades_caixa (
              id_modalidade BIGINT NOT NULL,
              name VARCHAR(50) NOT NULL,
              color VARCHAR(50) NOT NULL,
              CONSTRAINT modalidades_caixa_pkey PRIMARY KEY (id_modalidade));`;

    const modalidades_com_sabedoria =
      await sql`CREATE TABLE IF NOT EXISTS modalidades_com_sabedoria (
              id_modalidade BIGINT NOT NULL,
              name VARCHAR(50) NOT NULL,
              color VARCHAR(50) NOT NULL,
              CONSTRAINT modalidades_com_sabedoria_pkey PRIMARY KEY (id_modalidade));`;

    const modalidades_personalizadas =
      await sql`CREATE TABLE IF NOT EXISTS modalidades_personalizadas (
              id_modalidade BIGINT NOT NULL,
              name VARCHAR(50) NOT NULL,
              color VARCHAR(50) NOT NULL,
              CONSTRAINT modalidades_personalizadas_pkey PRIMARY KEY (id_modalidade));`;

    const configuracoes = await sql`CREATE TABLE IF NOT EXISTS configuracoes (
              ticket_bet_hour_limit TIME WITH TIME ZONE,
              ticket_max_value_per_ticket NUMERIC(15),
              ticket_max_amount_of_tickets_per_client NUMERIC NOT NULL,
              ticket_max_amount_of_duplicataed_tickets_per_lottery_draw NUMERIC NOT NULL,
              ticket_max_amount_of_duplicataed_tickets_per_bet NUMERIC NOT NULL,
              ticket_block_registration_of_duplicated_tickets BOOLEAN NOT NULL,
              surpresinha_allow_ilimited_registration_of_type_surpresinha_tickets BOOLEAN NOT NULL,
              surpresinha_allow_ilimited_registration_of_duplicated_type_surpresinha_tickets BOOLEAN NOT NULL,
              app_show_alert_for_duplicated_bets_during_creation BOOLEAN NOT NULL,
              app_start_bets_filter_showing_all_bets BOOLEAN NOT NULL,
              app_show_all_clients_to_all_sellers BOOLEAN NOT NULL,
              app_show_list_of_winners_to_sellers BOOLEAN NOT NULL,
              app_show_list_of_winners_to_clients BOOLEAN NOT NULL,
              app_show_list_of_winners_to_all_users BOOLEAN NOT NULL,
              app_show_inactive_sellers BOOLEAN NOT NULL,
              permit_enable_maximum_ticket_quantity_validation_for_admins BOOLEAN NOT NULL,
              permit_enable_maximum_ticket_value_validation_for_admins BOOLEAN NOT NULL,
              permit_enable_duplicate_ticket_blocking_validation_for_admins BOOLEAN NOT NULL,
              permit_enable_block_time_validation_for_admins BOOLEAN NOT NULL,
              permit_enable_sales_start_time_validation_for_admins BOOLEAN NOT NULL);`;

    return NextResponse.json(
      {
        credentials,
        users,
        lotteries,
        bets,
        modalidades_caixa,
        modalidades_com_sabedoria,
        modalidades_personalizadas,
        configuracoes,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
