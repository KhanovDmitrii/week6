import init from './app.js';
import express from 'express';
import body_parser from 'body-parser';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';

const app = init(express, body_parser, fs, crypto, http);

app.listen(process.env.PORT || 443);

