port module Header exposing (main)

import Html exposing (Html, div, h1, small, text)

main : Html a
main =
  div []
    [ h1 [] [ text "This header is in Elm!" ]
    , small [] [ text "But you will also see an error in the console :("]
    ]
