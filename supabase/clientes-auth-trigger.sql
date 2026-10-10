DO $setup$
DECLARE
    clientes_name text;
    clientes_table text;
    sequence_name text;
    sequence_qualified_name text;
    id_default text;
    id_sequence text;
    highest_id bigint;
    cliente_id_column text;
    cliente_name_column text;
    cliente_email_column text;
    cliente_phone_column text;
    cliente_birth_column text;
    cliente_created_column text;
BEGIN
    SELECT c.relname
    INTO clientes_name
    FROM pg_catalog.pg_class AS c
    JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND pg_catalog.lower(c.relname) = 'clientes'
      AND c.relkind IN ('r', 'p')
    ORDER BY c.relname
    LIMIT 1;

    IF clientes_name IS NULL THEN
        RAISE EXCEPTION 'Não foi encontrada a tabela public.CLIENTES.';
    END IF;

    clientes_table := pg_catalog.format('public.%I', clientes_name);

    SELECT column_name
    INTO cliente_id_column
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = clientes_name
      AND pg_catalog.lower(column_name) = 'id';

    SELECT column_name
    INTO cliente_name_column
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = clientes_name
      AND pg_catalog.lower(column_name) = 'nome';

    SELECT column_name
    INTO cliente_email_column
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = clientes_name
      AND pg_catalog.lower(column_name) IN ('email', 'e-mail');

    SELECT column_name
    INTO cliente_phone_column
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = clientes_name
      AND pg_catalog.lower(column_name) = 'telefone';

    SELECT column_name
    INTO cliente_birth_column
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = clientes_name
      AND pg_catalog.lower(column_name) = 'data_nascimento';

    SELECT column_name
    INTO cliente_created_column
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = clientes_name
      AND pg_catalog.lower(column_name) = 'criado_em';

    IF cliente_id_column IS NULL
       OR cliente_name_column IS NULL
       OR cliente_email_column IS NULL
       OR cliente_phone_column IS NULL
       OR cliente_birth_column IS NULL
       OR cliente_created_column IS NULL THEN
        RAISE EXCEPTION
            'A tabela public.% precisa das colunas id, nome, email (ou e-mail), telefone, data_nascimento e criado_em.',
            clientes_name;
    END IF;

    EXECUTE pg_catalog.format(
        'ALTER TABLE %s ENABLE ROW LEVEL SECURITY',
        clientes_table
    );

    SELECT column_default
    INTO id_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = clientes_name
      AND column_name = 'id';

    id_sequence := pg_catalog.pg_get_serial_sequence(clientes_table, 'id');

    IF id_default IS NULL AND id_sequence IS NULL THEN
        sequence_name := clientes_name || '_id_seq';
        sequence_qualified_name := pg_catalog.format('public.%I', sequence_name);

        EXECUTE pg_catalog.format(
            'CREATE SEQUENCE IF NOT EXISTS %s',
            sequence_qualified_name
        );
        EXECUTE pg_catalog.format(
            'ALTER SEQUENCE %s OWNED BY %s.id',
            sequence_qualified_name,
            clientes_table
        );
        EXECUTE pg_catalog.format(
            'ALTER TABLE %s ALTER COLUMN id SET DEFAULT pg_catalog.nextval(%L::regclass)',
            clientes_table,
            sequence_qualified_name
        );

        EXECUTE pg_catalog.format('SELECT max(id) FROM %s', clientes_table)
        INTO highest_id;

        PERFORM pg_catalog.setval(
            sequence_qualified_name::regclass,
            COALESCE(highest_id, 1),
            highest_id IS NOT NULL
        );
    END IF;

    EXECUTE pg_catalog.format($function$
        CREATE OR REPLACE FUNCTION public.create_cliente_from_auth_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = ''
        AS $body$
        DECLARE
            cliente_nome text;
        BEGIN
            cliente_nome := NULLIF(
                pg_catalog.btrim(NEW.raw_user_meta_data ->> 'nome'),
                ''
            );

            IF cliente_nome IS NULL THEN
                RAISE EXCEPTION 'O nome é obrigatório para criar o registo do cliente.';
            END IF;

            IF NEW.email IS NULL THEN
                RAISE EXCEPTION 'O e-mail é obrigatório para criar o registo do cliente.';
            END IF;

            INSERT INTO %1$s (
                %2$I,
                %3$I,
                %4$I,
                %5$I
            )
            VALUES (
                cliente_nome,
                pg_catalog.lower(NEW.email),
                NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'telefone'), ''),
                NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data ->> 'data_nascimento'), '')
            );

            RETURN NEW;
        END;
        $body$;
    $function$,
        clientes_table,
        cliente_name_column,
        cliente_email_column,
        cliente_phone_column,
        cliente_birth_column
    );

    EXECUTE 'REVOKE ALL ON FUNCTION public.create_cliente_from_auth_user() FROM PUBLIC';

    IF NOT EXISTS (
        SELECT 1
        FROM pg_catalog.pg_trigger AS t
        JOIN pg_catalog.pg_class AS c ON c.oid = t.tgrelid
        JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
        WHERE n.nspname = 'auth'
          AND c.relname = 'users'
          AND t.tgname = 'create_cliente_from_auth_user'
          AND NOT t.tgisinternal
    ) THEN
        EXECUTE '
            CREATE TRIGGER create_cliente_from_auth_user
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.create_cliente_from_auth_user()
        ';
    END IF;
END;
$setup$;
