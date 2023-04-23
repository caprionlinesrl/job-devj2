<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\Request;

class MoviesController extends AbstractController
{
    #[Route('/api/movies')]
public function list(Request $request, Connection $db): Response
{
    $queryBuilder = $db->createQueryBuilder()
        ->select("m.*")
        ->from("movies", "m");

    $params = $request->query->all();
    if (!empty($params)) {
        $orderByFields = [];
        foreach ($params as $param => $value) {
            if ($param == 'date') {
                if ($value == 'recent') {
                    $orderByFields[] = "m.release_date DESC";
                } elseif ($value == 'older') {
                    $orderByFields[] = "m.release_date ASC";
                }
            } elseif ($param == 'rating') {
                if ($value == 'descending') {
                    $orderByFields[] = "m.rating DESC";
                } elseif ($value == 'ascending') {
                    //non ho messo un controllo sui valori null quindi parte da null fino a 10
                    $orderByFields[] = "m.rating ASC";
                }
            }elseif($param == 'genre'){
                $genre = $request->query->get('genre');
                if ($genre) {
                    $queryBuilder
                        ->select('m.*, g.value as genre')
                        ->leftJoin('m', 'movies_genres', 'mg', 'm.id = mg.movie_id')
                        ->leftJoin('mg', 'genres', 'g', 'mg.genre_id = g.id')
                        ->andWhere('g.id = :type')
                        ->setParameter('type', $genre);
                }
            }
        }
        if (count($orderByFields) > 0) {
            $orderBy = implode(", ", $orderByFields);
            $queryBuilder->orderBy(null, $orderBy);
        }
    }
    $rows = $queryBuilder->executeQuery()->fetchAllAssociative();

    return $this->json([
        "movies" => $rows
    ]);
}

}
