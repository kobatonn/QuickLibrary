const int MAX_V = 10;
void warshall_floyd() {
  int dist[MAX_V][MAX_V];
  for (int k = 0; k < MAX_V; ++k)
    for (int i = 0; i < MAX_V; ++i)
      for (int j = 0; j < MAX_V; ++j)  dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
}