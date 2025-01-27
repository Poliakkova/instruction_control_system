PGDMP                      |            instructions_db    17.2    17.2     4           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            5           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            6           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            7           1262    16872    instructions_db    DATABASE     {   CREATE DATABASE instructions_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'ru_RU.UTF-8';
                     postgres    false            �            1259    17002    authkey    TABLE     K   CREATE TABLE public.authkey (
    id uuid NOT NULL,
    exp_time bigint
);

       public         heap r       postgres    false            �            1259    17007    control_system_user    TABLE       CREATE TABLE public.control_system_user (
    id uuid NOT NULL,
    user_notify_missed_deadline boolean,
    user_new_comment boolean,
    user_notify_new_instruction boolean,
    user_notify_status_change boolean,
    user_notify_week_report boolean,
    user_email character varying(255),
    user_job_title character varying(255),
    user_login character varying(255),
    user_name character varying(255),
    user_password character varying(255),
    user_patronymic character varying(255),
    user_surname character varying(255)
);
       public         heap r       postgres    false            �            1259    16924    databasechangelog    TABLE     Y  CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);
       public         heap r       postgres    false            �            1259    16883    databasechangeloglock    TABLE     �   CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);
       public         heap r       postgres    false            �            1259    17014    instructions    TABLE     �  CREATE TABLE public.instructions (
    id uuid NOT NULL,
    instruction_acquainted boolean,
    instruction_code character varying(255) NOT NULL,
    instruction_comment character varying(5000),
    done_time bigint,
    exp_time bigint,
    instruction_map_process character varying(10000),
    instruction_protocol character varying(255),
    instruction_report character varying(2000),
    instruction_short_description character varying(2000),
    instruction_source_of_instruction character varying(255),
    start_time bigint,
    instruction_status character varying(255),
    instruction_title character varying(255),
    instruction_type character varying(255)
);
       public         heap r       postgres    false            �            1259    17021    users_instructions    TABLE     o   CREATE TABLE public.users_instructions (
    user_entity_id uuid NOT NULL,
    instruction_id uuid NOT NULL
);
       public         heap r       postgres    false            .          0    17002    authkey 
   TABLE DATA           /   COPY public.authkey (id, exp_time) FROM stdin;
    public               postgres    false    219   �#       /          0    17007    control_system_user 
   TABLE DATA             COPY public.control_system_user (id, user_notify_missed_deadline, user_new_comment, user_notify_new_instruction, user_notify_status_change, user_notify_week_report, user_email, user_job_title, user_login, user_name, user_password, user_patronymic, user_surname) FROM stdin;
    public               postgres    false    220   �#       -          0    16924    databasechangelog 
   TABLE DATA           �   COPY public.databasechangelog (id, author, filename, dateexecuted, orderexecuted, exectype, md5sum, description, comments, tag, liquibase, contexts, labels, deployment_id) FROM stdin;
    public               postgres    false    218   �$       ,          0    16883    databasechangeloglock 
   TABLE DATA           R   COPY public.databasechangeloglock (id, locked, lockgranted, lockedby) FROM stdin;
    public               postgres    false    217   �%       0          0    17014    instructions 
   TABLE DATA           H  COPY public.instructions (id, instruction_acquainted, instruction_code, instruction_comment, done_time, exp_time, instruction_map_process, instruction_protocol, instruction_report, instruction_short_description, instruction_source_of_instruction, start_time, instruction_status, instruction_title, instruction_type) FROM stdin;
    public               postgres    false    221   �%       1          0    17021    users_instructions 
   TABLE DATA           L   COPY public.users_instructions (user_entity_id, instruction_id) FROM stdin;
    public               postgres    false    222   �%       �
           2606    17006    authkey authkey_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.authkey
    ADD CONSTRAINT authkey_pkey PRIMARY KEY (id);
       public                 postgres    false    219            �
           2606    17013 ,   control_system_user control_system_user_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.control_system_user
    ADD CONSTRAINT control_system_user_pkey PRIMARY KEY (id);
       public                 postgres    false    220            �
           2606    16887 0   databasechangeloglock databasechangeloglock_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);
       public                 postgres    false    217            �
           2606    17020    instructions instructions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.instructions
    ADD CONSTRAINT instructions_pkey PRIMARY KEY (id);
       public                 postgres    false    221            �
           2606    17025 0   control_system_user uk_in092qoasws8xk7dy16la1vm3 
   CONSTRAINT     q   ALTER TABLE ONLY public.control_system_user
    ADD CONSTRAINT uk_in092qoasws8xk7dy16la1vm3 UNIQUE (user_login);
       public                 postgres    false    220            �
           2606    17027 )   instructions uk_keue4exkflntxiht4ouadsqe8 
   CONSTRAINT     p   ALTER TABLE ONLY public.instructions
    ADD CONSTRAINT uk_keue4exkflntxiht4ouadsqe8 UNIQUE (instruction_code);
       public                 postgres    false    221            �
           2606    17033 .   users_instructions fk1x696xrvqqagu4glm12d33cmn 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.users_instructions
    ADD CONSTRAINT fk1x696xrvqqagu4glm12d33cmn FOREIGN KEY (user_entity_id) REFERENCES public.control_system_user(id);
       public               postgres    false    220    3474    222            �
           2606    17028 .   users_instructions fkb0js31rd4rugaqsj1p37lsorg 
   FK CONSTRAINT     �   ALTER TABLE ONLY public.users_instructions
    ADD CONSTRAINT fkb0js31rd4rugaqsj1p37lsorg FOREIGN KEY (instruction_id) REFERENCES public.instructions(id);
       public               postgres    false    222    3478    221            .   <   x���� �w�zrJ/�B�/��l�����(7
����F8�M8z�B�[D���      /   �   x�U̱�0@љ~kI��fE��q21�B����41w8��dA����pE
+5f4֔�@3J�旝���	$$��5�
�����6"��Df�WӍ�7 �p7��/+nq��L�u_�b.�p����s"���G骶��"���
�=���D4	      -   �   x����j�0���S��Z�-ہ���Fw�`�B�����C�~��`�e�����>��!�i��8���������ː=u���L�c���]X���
�؍�/���v5���ⶽ�.��;��p:G,J�@QXŀU�����3SK�E'�v�0���0G�9���?�����&9(.n��H"$І��y�'��0�R�R
n
�E��x!�k��.
�[d��@5��+U��(�TّgY�zX�b      ,      x�3�L��"�=... U�      0   
   x������ � �      1   
   x������ � �     